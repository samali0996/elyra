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

jest.mock('@elyra/services');
// jest.mock('@jupyterlab/apputils');
// const apputils: any = jest.genMockFromModule('@jupyterlab/apputils');
// apputils.showDialog = jest.fn(async () => Promise.resolve('hello'));
// jest.mock('') jest.fn(() => Promise.resolve({ data: {} }));
// .mockImplementation(() => ({
//   showDialog: Promise.resolve('hello'
// }));
// , () => {
//   return {
//     showDialog: 'hello'
//   };
// });
// jest.unmock('@jupyterlab/testutils');
import { posix } from 'path';

import { MetadataService, RequestHandler } from '@elyra/services';
// look into jupyter lab testutils to see if there are mocks there, look through this to see all that you can use
import {
  JupyterServer,
  waitForDialog,
  acceptDialog
  // dismissDialog
} from '@jupyterlab/testutils';

import {
  PipelineService,
  IRuntimeType,
  RUNTIMES_SCHEMASPACE
} from '../PipelineService';

import {
  expected_runtime_types,
  expected_runtimes,
  expected_schema,
  expected_pipeline,
  expected_pipeline_json
} from './mock-data';

jest.setTimeout(1 * 60 * 1000);

const server = new JupyterServer();
let runtime_types: IRuntimeType[];

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.shutdown();
});

beforeEach(() => {
  jest.clearAllMocks();
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
  it.each([
    [
      'run-generic-pipelines-on-kubeflow-pipelines/hello-generic-world.pipeline',
      '../introduction-to-generic-pipelines/load_data.ipynb',
      'introduction-to-generic-pipelines/load_data.ipynb'
    ],
    [
      'hello-generic-world.pipeline',
      'run-generic-pipelines-on-kubeflow-pipelines/Part 3 - Time Series Forecasting.ipynb',
      'run-generic-pipelines-on-kubeflow-pipelines/Part 3 - Time Series Forecasting.ipynb'
    ],
    [
      'run-generic-pipelines-on-kubeflow-pipelines/doc/hello-generic-world.pipeline',
      '../../introduction-to-generic-pipelines/Part 1 - Data Cleaning.ipynb',
      'introduction-to-generic-pipelines/Part 1 - Data Cleaning.ipynb'
    ],
    [
      'run-generic-pipelines-on-kubeflow-pipelines/hello/hello-generic-world.pipeline',
      '../load_data.ipynb',
      'run-generic-pipelines-on-kubeflow-pipelines/load_data.ipynb'
    ]
  ])(
    'should get workspace relative node path',
    (pipelinePath, nodePath, workspacePath) => {
      const path = PipelineService.getWorkspaceRelativeNodePath(
        pipelinePath,
        nodePath
      );
      expect(removeCwdFromPath(path)).toBe(workspacePath);
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
  describe('setNodePathsRelativeToWorkspace', () => {
    // maybe take out this nested describe?
    let getWorkspaceRelativeNodePathSpy: jest.SpyInstance;
    beforeAll(() => {
      getWorkspaceRelativeNodePathSpy = jest.spyOn(
        PipelineService,
        'getWorkspaceRelativeNodePath'
      );
      const pipelinePath =
        'run-generic-pipelines-on-kubeflow-pipelines/hello-generic-world.pipeline';
      PipelineService.setNodePathsRelativeToWorkspace(
        expected_pipeline,
        pipelinePath
      );
    });
    afterAll(() => {
      jest.clearAllMocks();
    });

    it.each([
      [0, 'run-generic-pipelines-on-kubeflow-pipelines/load_data.ipynb'],
      [
        1,
        'run-generic-pipelines-on-kubeflow-pipelines/Part 1 - Data Cleaning.ipynb'
      ],
      [
        2,
        'run-generic-pipelines-on-kubeflow-pipelines/Part 2 - Data Analysis.ipynb'
      ]
    ])(
      'should set Node paths with valid op to relative to workspace',
      (nodeIndex, result) => {
        const filePath = removeCwdFromPath(
          expected_pipeline.nodes[nodeIndex].app_data.component_parameters
            .filename
        );
        expect(filePath).toBe(result);
      }
    );
    it('should not set workspace relative nodepath with invalid op', () => {
      expect(
        expected_pipeline.nodes[3].app_data.component_parameters.filename
      ).toBe('Part 3 - Time Series Forecasting.ipynb');
      expect(getWorkspaceRelativeNodePathSpy).toHaveBeenCalledTimes(3);
    });
  });
  it.only('should submit pipeline', async () => {
    // add utils, get dialog body, get dialog title
    // check that request handler was called with proper params
    // check that dialog is rendered with correct info
    // check difference between local and with external runtime
    // check that the
    // jest.mock('@jupyterlab/apputils');
    const mockReturn = {
      platform: 'LOCAL',
      run_url: '',
      object_storage_url: '',
      object_storage_path: ''
    };
    // mock the things that call the request handler
    // mock this so that only this file has access to this
    const makePostRequestSpy = jest
      .spyOn(RequestHandler, 'makePostRequest')
      .mockResolvedValueOnce(
        Promise.resolve({
          // platform: 'APACHE_AIRFLOW',
          // run_url: 'www.example.com',
          // object_storage_url: 'www.object_storage.com',
          // object_storage_path: 'foo/bar'
        })
      );
    const node = document.body;

    // document.body.appendChild(node);
    const prompt = PipelineService.submitPipeline(
      expected_pipeline_json,
      'Kubeflow Pipelines'
    );

    await waitForDialog();
    console.log(node);
    console.log(node.getElementsByClassName('jp-Dialog')[0].innerHTML);
    // expect(node.querySelector('.jp-Dialog-close-button')).toBeTruthy();
    await acceptDialog();
    const result = await prompt;
    expect(result).toBe(false);
  });
  // make test for getWaitDialog
});

const PACKAGE_DIRECTORY = process.cwd();
/**
 * Helper function to remove cwd from a path to mock elyra environment workspace path
 */
// try to turn this into a mock
const removeCwdFromPath = (filePath: string): string => {
  return posix.relative(PACKAGE_DIRECTORY, `/${filePath}`);
};
