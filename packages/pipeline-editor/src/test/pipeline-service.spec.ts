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
import { MetadataService } from '@elyra/services';
import { JupyterServer } from '@jupyterlab/testutils';

import {
  PipelineService,
  IRuntimeType,
  RUNTIMES_SCHEMASPACE
} from '../PipelineService';

import {
  expected_runtime_types,
  expected_runtimes,
  expected_schema
} from './mock-data';

const server = new JupyterServer();
let runtime_types: IRuntimeType[];

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.shutdown();
});

describe('PipelineService', () => {
  it('should get runtime types ordered by id', async () => {
    runtime_types = await PipelineService.getRuntimeTypes();
    const expected_runtime_ids = [
      'APACHE_AIRFLOW',
      'KUBEFLOW_PIPELINES',
      'LOCAL'
    ];
    expect(runtime_types).toStrictEqual(expected_runtime_types);
    expect(runtime_types.map(runtime_type => runtime_type.id)).toStrictEqual(
      expected_runtime_ids
    );
  });
  it.each([
    ['pipelines/my.pipeline', 'nodes/load_data.py', '../nodes/load_data.py'],
    ['my.pipeline', 'nodes/load_data.py', 'nodes/load_data.py'],
    ['pipelines/my.pipeline', 'load_data.py', '../load_data.py'],
    ['my.pipeline', 'load_data.py', 'load_data.py']
  ])(
    'should get pipeline-relative node path',
    (pipelinePath, nodePath, result) => {
      const path = PipelineService.getPipelineRelativeNodePath(
        pipelinePath,
        nodePath
      );
      expect(path).toBe(result);
    }
  );
  it.each([[expected_runtimes], [[]]])(
    'should get runtimes',
    async runtimes => {
      const spyOnGetMetadata = jest
        .spyOn(MetadataService, 'getMetadata')
        .mockImplementation(async () => runtimes);
      const runtimes_response = await PipelineService.getRuntimes();

      expect(spyOnGetMetadata).toHaveBeenCalledWith(RUNTIMES_SCHEMASPACE);
      expect(runtimes_response).toStrictEqual(runtimes);
    }
  );
  it('should get runtime schemas', async () => {
    const schemaResponse = await PipelineService.getRuntimesSchema();
    expect(schemaResponse).toStrictEqual(expected_schema);
  });
});
