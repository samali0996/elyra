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

import { JupyterServer } from '@jupyterlab/testutils';
import { PathExt } from '@jupyterlab/coreutils';
import { posix } from 'path';

import { PipelineService, IRuntimeType } from '../PipelineService';
jest.setTimeout(3 * 60 * 1000);

const server = new JupyterServer();
let runtime_types: IRuntimeType[];

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.shutdown();
});

// jest.mock('@jupyterlab/coreutils', () => {
//   return {
//     resolve: jest.fn(() => false)
//   };
// });

describe('PipelineService', () => {
  it('should get runtime types ordered by id', async () => {
    runtime_types = await PipelineService.getRuntimeTypes();
    const expected_runtime_ids = [
      'APACHE_AIRFLOW',
      'KUBEFLOW_PIPELINES',
      'LOCAL'
    ];
    expect(runtime_types.map(runtime_type => runtime_type.id)).toStrictEqual(
      expected_runtime_ids
    );
  });
  it('should get pipeline-relative node path', () => {
    let path = PipelineService.getPipelineRelativeNodePath(
      'pipelines/my.pipeline',
      'nodes/load_data.py'
    );
    expect(path).toBe('../nodes/load_data.py');
    path = PipelineService.getPipelineRelativeNodePath(
      'my.pipeline',
      'nodes/load_data.py'
    );
    expect(path).toBe('nodes/load_data.py');
    path = PipelineService.getPipelineRelativeNodePath(
      'pipelines/my.pipeline',
      'load_data.py'
    );
    expect(path).toBe('../load_data.py');
    path = PipelineService.getPipelineRelativeNodePath(
      'my.pipeline',
      'load_data.py'
    );
    expect(path).toBe('load_data.py');
  });
  it('should get runtimes', async () => {
    const runtimes = await PipelineService.getRuntimes();
    console.log('runtimes are', runtimes);
    expect(true).toBe(false);
  });
  // it('should get the workspace-relative node path', () => {
  //   process.cwd = jest.fn().mockReturnValue('/hello/world')
  //   // process.cwd = jest.spyOn(process, 'cwd');
  //   // spy.mockReturnValue('mocke/value');
  //   let path = PipelineService.getWorkspaceRelativeNodePath('data/my.pipeline', '../load_data.py')
  //   expect(path).toBe('')
  //   // spy.mockClear()
  // })
  // it('should do something else', () => {
  //   expect('').toBe(process.cwd())
  // })
});
