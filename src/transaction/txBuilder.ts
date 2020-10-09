import BN from 'bn.js';
import { uniq } from 'lodash';

import * as Encoders from '@lib/transaction/encoders';
import * as Interfaces from '@lib/common/interfaces';
import * as Constants from '@lib/common/constants';

export interface ICreateTransactionBody {
  fromAddress: string;
  fromUtxos: Array<Interfaces.IUTXO>;
  payments: Array<Interfaces.IPayment>;
  fee: Interfaces.IFeeDetail;
  metadata?: string;
}

/** @internal */
export function createTransactionBody ({
  fromAddress,
  fromUtxos,
  payments,
  fee,
  metadata
}: ICreateTransactionBody): Partial<Interfaces.ITransactionBody> {
  const allPayments = [...payments, fee]
  const neededCurrencies = uniq([...payments.map(i => i.currency), fee.currency])

  function calculateChange (inputs) {
    return neededCurrencies.map(currency => {
      const needed = allPayments.reduce((acc, i) => {
        return i.currency === currency
          ? acc.add(new BN(i.amount.toString()))
          : acc
      }, new BN(0))
      const supplied = inputs.reduce((acc, i) => {
        return i.currency === currency
          ? acc.add(new BN(i.amount.toString()))
          : acc
      }, new BN(0))
      const change = supplied.sub(needed)
      return {
        currency,
        needed,
        supplied,
        change
      }
    })
  }

  // check if fromUtxos has sufficient amounts to cover payments and fees
  // compare how much we need vs how much supplied per currency
  const change = calculateChange(fromUtxos)
  for (const i of change) {
    if (i.needed.gt(i.supplied)) {
      const diff = i.needed.sub(i.supplied)
      throw new Error(`Insufficient funds. Needs ${diff.toString()} more of ${i.currency} to cover payments and fees`)
    }
  }

  // get inputs array by filtering the fromUtxos we will actually use (respecting order)
  const changeCounter = [...change]
  const inputs = fromUtxos.filter(fromUtxo => {
    const foundIndex = changeCounter.findIndex(i => i.currency === fromUtxo.currency)
    const foundItem = changeCounter[foundIndex]
    if (!foundItem || foundItem.needed.lte(new BN(0))) {
      return false
    }
    changeCounter[foundIndex] = {
      ...foundItem,
      needed: foundItem.needed.sub(new BN(fromUtxo.amount.toString()))
    }
    return true
  })
  validateInputs(inputs)

  // recalculate change with filtered fromUtxos array, and create outputs (payments + changeOutputs)
  const recalculatedChange = calculateChange(inputs)
  const changeOutputs = recalculatedChange
    .filter(i => i.change.gt(new BN(0)))
    .map(i => ({
      outputType: 1,
      outputGuard: fromAddress,
      currency: i.currency,
      amount: i.change
    }))
  const paymentOutputs = payments.map(i => ({
    outputType: 1,
    outputGuard: i.owner,
    currency: i.currency,
    amount: i.amount
  }))
  const outputs: Array<Interfaces.IOutput> = [...changeOutputs, ...paymentOutputs];
  validateOutputs(outputs)

  const encodedMetadata = metadata
    ? Encoders.encodeMetadata(metadata)
    : Constants.NULL_METADATA;

  const txBody = {
    inputs,
    outputs,
    txData: 0,
    metadata: encodedMetadata
  }

  return txBody;
}

/** @internal */
function validateInputs (arg): void {
  if (!Array.isArray(arg)) {
    throw new Error('Inputs must be an array');
  }
  if (arg.length === 0 || arg.length > Constants.MAX_INPUTS) {
    throw new Error(`Inputs must be an array of size > 0 and < ${Constants.MAX_INPUTS}`);
  }
}

/** @internal */
function validateOutputs (arg): void {
  if (!Array.isArray(arg)) {
    throw new Error('Outputs must be an array');
  }
  if (arg.length > Constants.MAX_OUTPUTS) {
    throw new Error(`Outputs must be an array of size < ${Constants.MAX_OUTPUTS}`);
  }
}
