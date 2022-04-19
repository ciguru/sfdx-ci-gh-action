/*******************************************************************************
 * Copyright (c) 2022, Customertimes Software
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as Core from '@actions/core';
import * as GitHub from '@actions/github';
import JsYaml from 'js-yaml';
import { NoRequiredInput, IncorrectContent } from './errors';

interface Inputs {
  [k: string]: string | number | boolean | null;
}

function getInput(inputName: string, required: boolean): string {
  try {
    return Core.getInput(inputName, { required });
  } catch (e) {
    throw new NoRequiredInput(inputName);
  }
}

function getObjectInput(inputName: string, required: boolean): Inputs {
  let input: string;
  try {
    input = Core.getInput(inputName, { required });
  } catch (e) {
    throw new NoRequiredInput(inputName);
  }
  try {
    return JsYaml.load(input) as Inputs;
  } catch (e) {
    throw new IncorrectContent(inputName, 'YAML');
  }
}

interface Constants {
  input: {
    configurationFile: string;
    inputs: Inputs;
  };
  dirname: string;
  repo: {
    owner: string;
    repo: string;
    prNumber: number;
    // token: string;
    headSha: string;
    baseSha?: string;
  };
}

function setConstants(): Constants {
  const pullRequest = GitHub.context.payload.pull_request;

  Core.info(`PR: ${JSON.stringify(pullRequest)}`);

  return {
    input: {
      configurationFile: getInput('configurationFile', true),
      inputs: getObjectInput('inputs', true),
    },
    dirname: process.env.GITHUB_WORKSPACE || __dirname,
    repo: {
      owner: GitHub.context.repo.owner,
      repo: GitHub.context.repo.repo,
      prNumber: pullRequest?.number || -1,
      // token: getInput('token', true),
      headSha: pullRequest ? pullRequest.head.sha : GitHub.context.sha,
      baseSha: pullRequest?.base?.sha,
    },
  };
}

Core.info(`Envs: ${JSON.stringify(process.env)}`);
const constants: Constants = setConstants();
Core.debug(`Inputs: ${JSON.stringify(constants)}`);

export default constants;
