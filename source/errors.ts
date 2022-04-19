/*******************************************************************************
 * Copyright (c) 2022, Customertimes Software
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

export class NoRequiredInput extends Error {
  constructor(inputName: string) {
    super(`There is no required input: '${inputName}'`);
  }
}

export class IncorrectContent extends Error {
  name = 'IncorrectContent';
  constructor(inputName: string, contentType: string) {
    super(`Input '${inputName}' must contain valid ${contentType} data.`);
  }
}
