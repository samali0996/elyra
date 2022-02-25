/*
 * Copyright 2018-2022 Elyra Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// TODO make it so that we can control what is returned based on the parameters?
export class RequestHandler {
  static async makePostRequest(
    str: any,
    pipeline: any,
    diag: any
  ): Promise<any> {
    const localreturn = {
      platform: 'LOCAL',
      run_url: '',
      object_storage_url: '',
      object_storage_path: ''
    };
    const externalResponse = {
      platform: 'APACHE_AIRFLOW',
      run_url: 'www.example.com',
      object_storage_url: 'www.object_storage.com',
      object_storage_path: 'foo/bar'
    };

    return Promise.resolve({});
    // return Promise.resolve({});
  }
}
