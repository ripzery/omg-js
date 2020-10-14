/*
Copyright 2020 OmiseGO Pte Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import * as Interfaces from '@lib/common/interfaces';
import * as Transporter from '@lib/transport';
import * as Util from '@lib/common/util';

export interface IInFlightExitGetInputChallengeData {
  txbytes: string;
  inputIndex: number;
};

// NMTODO: figure out this interface
export interface IInflightExitInputChallengeData {};

/** @internal */
export async function inFlightExitGetInputChallengeData ({
  txbytes,
  inputIndex
}: IInFlightExitGetInputChallengeData): Promise<IInflightExitInputChallengeData> {
  return Transporter.post({
    url: `${this.watcherSecurityUrl}/in_flight_exit.get_input_challenge_data`,
    body: {
      txbytes: Util.prefixHex(txbytes),
      input_index: inputIndex
    },
    proxyUrl: this.watcherProxyUrl
  });
}

export interface IInFlightExitGetOutputChallengeData {
  txbytes: string;
  outputIndex: number;
};

// NMTODO: figure out this interface
export interface IInflightExitOutputChallengeData {};

/** @internal */
export async function inFlightExitGetOutputChallengeData ({
  txbytes,
  outputIndex
}: IInFlightExitGetOutputChallengeData): Promise<IInflightExitOutputChallengeData> {
  return Transporter.post({
    url: `${this.watcherSecurityUrl}/in_flight_exit.get_output_challenge_data`,
    body: {
      txbytes: Util.prefixHex(txbytes),
      output_index: outputIndex
    },
    proxyUrl: this.watcherProxyUrl
  });
}

/** @internal */
export async function inFlightExitGetData (txbytes: string): Promise<Interfaces.IInflightExitData> {
  return Transporter.post({
    url: `${this.watcherSecurityUrl}/in_flight_exit.get_data`,
    body: {
      txbytes: Util.prefixHex(txbytes)
    },
    proxyUrl: this.watcherProxyUrl
  });
}

// NMTODO: figure out this interface
export interface IInflightExitCompetitor {};

/** @internal */
export async function inFlightExitGetCompetitor (txbytes: string): Promise<IInflightExitCompetitor> {
  return Transporter.post({
    url: `${this.watcherSecurityUrl}/in_flight_exit.get_competitor`,
    body: {
      txbytes: Util.prefixHex(txbytes)
    },
    proxyUrl: this.watcherProxyUrl
  });
}

/** @internal */
export async function inFlightExitProveCanonical (txbytes: string): Promise<string> {
  return Transporter.post({
    url: `${this.watcherSecurityUrl}/in_flight_exit.prove_canonical`,
    body: {
      txbytes: Util.prefixHex(txbytes)
    },
    proxyUrl: this.watcherProxyUrl
  });
}
