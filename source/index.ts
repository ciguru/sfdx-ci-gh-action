/*******************************************************************************
 * Copyright (c) 2022, Customertimes Software
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as Core from '@actions/core';
// import CiEngine from '@ciguru/sfdx-ci-engine';
import { JSONSchemaForCTSoftwareSFDXCIConfiguration as SchemaV1 } from '@ciguru/sfdx-ci-engine/dist/lib/schema-v1.0.0';
import Constants from './constants';
import { NoRequiredInput } from './errors';

class CiEngine {
  event: any;
  constructor(str: string) {
    console.log(str);
  }
  async loadSettings(): Promise<any> {
    console.log('');
  }
  setGlobalInputs(inputs: Inputs) {
    console.log(inputs);
  }
  run() {
    console.log('');
  }
  getOutputs(): any {
    console.log('');
  }
  getStep(str: string): { number: number; total: number; step: any } {
    return { number: 1, total: 1, step: str };
  }
}

interface Inputs {
  [k: string]: string | null;
}

async function run() {
  try {
    // Init CI Engine
    const ci = new CiEngine(Constants.input.configurationFile);
    registerListeners(ci);

    // Get Configuration
    const config: SchemaV1 = await ci.loadSettings();

    // Set inputs
    const inputs: Inputs = getInputs(config);
    ci.setGlobalInputs(inputs);

    // Execute
    await ci.run();

    // Set outputs
    Core.setOutput('status', 0);
    Core.setOutput('result', ci.getOutputs());
    process.exit(0);
  } catch (e) {
    // Set outputs
    Core.setOutput('status', 1);
    Core.setOutput('error', (e as Error).message);

    // Set statuses
    Core.setFailed((e as Error).message);
    process.exit(1);
  }
}

function registerListeners(ci: CiEngine): void {
  let currenStepString: string;
  ci.event.on('step_start', (stepId: string) => {
    const data = ci.getStep(stepId);
    if (data) {
      const prefix = `[${data.number + 1}/${data.total}]`;
      const info = data.step.description || `Step ${data.step.id}`;
      currenStepString = `${prefix} ${info}`;
    } else {
      currenStepString = 'Undefined step';
    }
    Core.info(`${currenStepString}... In Progress`);
  });
  ci.event.on('step_finish', () => {
    Core.info(`${currenStepString}... Done`);
  });
  ci.event.on('step_error', (message: string) => {
    Core.error(`Error: ${message}`);
  });
}

function getInputs(config: SchemaV1): Inputs {
  const inputs: Inputs = {};
  if (config.inputs && config.inputs.length > 0) {
    for (const input of config.inputs) {
      const defaultValue = () => {
        if (Constants.input.inputs[input.id]) {
          return String(Constants.input.inputs[input.id]);
        }
        if (input.default) {
          return String(input.default);
        }
        return undefined;
      };

      const value: string | undefined = defaultValue();

      if (input.required && !value) {
        throw new NoRequiredInput(input.id);
      } else {
        inputs[input.id] = value || null;
      }
    }
  }
  return inputs;
}

Core.info(`__filename: ${__filename}`);

run().then();
