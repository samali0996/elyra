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

// jest.unmock('@elyra/services');
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

jest.setTimeout(1 * 60 * 4000);

const server = new JupyterServer();
let runtime_types: IRuntimeType[];

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.shutdown();
});

afterEach(() => {
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
    (pipelinePath, nodePath, workspaceNodePath) => {
      const path = PipelineService.getWorkspaceRelativeNodePath(
        pipelinePath,
        nodePath
      );
      expect(removeCwdFromPath(path)).toBe(workspaceNodePath);
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
  it.each([
    [
      expected_pipeline,
      'run-generic-pipelines-on-kubeflow-pipelines/hello-generic-world.pipeline',
      [
        'run-generic-pipelines-on-kubeflow-pipelines/load_data.ipynb',
        'run-generic-pipelines-on-kubeflow-pipelines/Part 1 - Data Cleaning.ipynb',
        'run-generic-pipelines-on-kubeflow-pipelines/Part 2 - Data Analysis.ipynb',
        'Part 3 - Time Series Forecasting.ipynb'
      ],
      3
    ]
  ])(
    'should set Node paths with valid op to relative to workspace',
    (pipeline, pipelinePath, result, expectedGetPathCalls) => {
      const getWorkspaceRelativeNodePathSpy = jest.spyOn(
        PipelineService,
        'getWorkspaceRelativeNodePath'
      );
      PipelineService.setNodePathsRelativeToWorkspace(pipeline, pipelinePath);
      pipeline.nodes.forEach((node: any, index: any) => {
        let filePath = node.app_data.component_parameters.filename;
        if (
          [
            'execute-notebook-node',
            'execute-python-node',
            'execute-r-node'
          ].includes(node.op)
        ) {
          filePath = removeCwdFromPath(
            node.app_data.component_parameters.filename
          );
        }
        expect(filePath).toBe(result[index]);
      });
      expect(getWorkspaceRelativeNodePathSpy).toHaveBeenCalledTimes(
        expectedGetPathCalls
      );
    }
  );
  it.each([
    [
      {
        platform: 'LOCAL',
        run_url: '',
        object_storage_url: '',
        object_storage_path: ''
      },
      'Local',
      {
        header: 'Job execution succeeded',
        body: {
          content: ['in-place', 'local environment'],
          hrefs: []
        }
      }
    ],
    [
      {
        platform: 'APACHE_AIRFLOW',
        git_url: 'www.airflow_git.com',
        run_url: 'www.airflow_run.com',
        object_storage_url: 'www.airflow_storage.com',
        object_storage_path: 'airflow/path'
      },
      'Apache Airflow',
      {
        header: 'Job submission to Apache Airflow succeeded',
        body: {
          content: [
            'Apache Airflow DAG',
            'Git repository',
            'Run Details',
            'airflow/path',
            'object storage'
          ],
          hrefs: [
            'www.airflow_git.com',
            'www.airflow_run.com',
            'www.airflow_storage.com'
          ]
        }
      }
    ],
    [
      {
        platform: 'KUBEFLOW_PIPELINES',
        run_url: 'www.kube_run.com',
        object_storage_url: 'www.kube_storage.com',
        object_storage_path: 'kube/path'
      },
      'Kubeflow Pipelines',
      {
        header: 'Job submission to Kubeflow Pipelines succeeded',
        body: {
          content: ['Run Details', 'kube/path', 'object storage'],
          hrefs: ['www.kube_run.com', 'www.kube_storage.com']
        }
      }
    ]
  ])(
    'should submit pipeline',
    async (mockPostResponse, runtimeName, expectedDialogDetails) => {
      const makePostRequestSpy = jest
        .spyOn(RequestHandler, 'makePostRequest')
        .mockResolvedValue(Promise.resolve(mockPostResponse));
      const node = document.body;

      PipelineService.submitPipeline(expected_pipeline_json, runtimeName);

      await waitForDialog();
      expect(makePostRequestSpy).toHaveBeenCalledWith(
        'elyra/pipeline/schedule',
        JSON.stringify(expected_pipeline_json),
        PipelineService.getWaitDialog('Packaging and submitting pipeline ...')
      );

      const dialog = node.getElementsByClassName('jp-Dialog')[0];
      expect(
        dialog.getElementsByClassName('jp-Dialog-header')[0].textContent
      ).toBe(expectedDialogDetails.header);
      const dialogBody = dialog.getElementsByClassName('jp-Dialog-body')[0];
      expectedDialogDetails.body.content.forEach((keyword: string) => {
        expect(dialogBody.textContent).toContain(keyword);
      });
      expectedDialogDetails.body.hrefs.forEach(
        (href: string, index: number) => {
          expect(
            dialog.getElementsByTagName('a')[index].getAttribute('href')
          ).toEqual(href);
        }
      );
      await acceptDialog();
    }
  );
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
