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
export const expected_runtime_types = [
  {
    id: 'APACHE_AIRFLOW',
    display_name: 'Apache Airflow',
    icon: 'static/elyra/airflow.svg',
    export_file_types: [
      {
        id: 'py',
        display_name: 'Airflow domain-specific language Python code'
      }
    ]
  },
  {
    id: 'KUBEFLOW_PIPELINES',
    display_name: 'Kubeflow Pipelines',
    icon: 'static/elyra/kubeflow.svg',
    export_file_types: [
      {
        id: 'yaml',
        display_name: 'KFP static configuration file (YAML formatted)'
      }
    ]
  },
  {
    id: 'LOCAL',
    display_name: 'Local',
    icon: 'static/elyra/pipeline-flow.svg',
    export_file_types: []
  }
];

export const expected_runtimes = [
  {
    name: 'kfp-local',
    display_name: 'Kubeflow Pipeline (local)',
    metadata: {
      api_endpoint: 'http://localhost:31380/pipeline',
      engine: 'Argo',
      auth_type: 'NO_AUTHENTICATION',
      cos_endpoint: 'http://minio-service.kubeflow.svc.cluster.local:9000',
      cos_bucket: 'covid',
      cos_auth_type: 'USER_CREDENTIALS',
      cos_username: 'minio',
      cos_password: 'minio123',
      runtime_type: 'KUBEFLOW_PIPELINES'
    },
    schema_name: 'kfp'
  }
];

export const expected_schema = [
  {
    $schema:
      'https://raw.githubusercontent.com/elyra-ai/elyra/master/elyra/metadata/schemas/meta-schema.json',
    $id:
      'https://raw.githubusercontent.com/elyra-ai/elyra/master/elyra/metadata/schemas/airflow.json',
    title: 'Apache Airflow',
    name: 'airflow',
    schemaspace: 'runtimes',
    schemaspace_id: '130b8e00-de7c-4b32-b553-b4a52824a3b5',
    metadata_class_name:
      'elyra.pipeline.airflow.airflow_metadata.AirflowMetadata',
    runtime_type: 'APACHE_AIRFLOW',
    uihints: {
      title: 'Apache Airflow runtimes',
      icon: 'elyra:runtimes',
      reference_url:
        'https://elyra.readthedocs.io/en/latest/user_guide/runtime-conf.html'
    },
    properties: {
      schema_name: {
        title: 'Schema Name',
        description: 'The schema associated with this instance',
        type: 'string',
        const: 'airflow'
      },
      display_name: {
        title: 'Display Name',
        description: 'Display name of this Apache Airflow configuration',
        type: 'string',
        minLength: 1
      },
      metadata: {
        description: 'Additional data specific to this metadata',
        type: 'object',
        properties: {
          runtime_type: {
            title: 'Runtime Type',
            description: 'The runtime associated with this instance',
            type: 'string',
            const: 'APACHE_AIRFLOW',
            uihints: {
              hidden: true
            }
          },
          description: {
            title: 'Description',
            description: 'Description of this Apache Airflow configuration',
            type: 'string'
          },
          api_endpoint: {
            title: 'Apache Airflow UI Endpoint',
            description: 'The Apache Airflow UI endpoint',
            type: 'string',
            format: 'uri',
            uihints: {
              category: 'Apache Airflow',
              placeholder: 'https://your-airflow-webserver:port'
            }
          },
          user_namespace: {
            title: 'Apache Airflow User Namespace',
            description:
              'The Apache Airflow user namespace used to run DAG workflows',
            type: 'string',
            pattern: '^[a-z0-9][-a-z0-9]*[a-z0-9]$',
            maxLength: 63,
            default: 'default',
            uihints: {
              category: 'Apache Airflow'
            }
          },
          git_type: {
            title: 'Git type',
            description: 'Git provider',
            type: 'string',
            enum: ['GITHUB'],
            default: 'GITHUB',
            uihints: {
              field_type: 'dropdown',
              category: 'Apache Airflow'
            }
          },
          github_api_endpoint: {
            title: 'GitHub or GitLab server API Endpoint',
            description:
              'The GitHub or GitLab server URL / API endpoint - Public or Enterprise',
            type: 'string',
            format: 'uri',
            default: 'https://api.github.com',
            uihints: {
              category: 'Apache Airflow',
              placeholder: 'https://your-github-or-gitlab-endpoint'
            }
          },
          github_repo: {
            title: 'GitHub or GitLab DAG Repository',
            description: 'Existing repository where DAGs are stored',
            type: 'string',
            uihints: {
              category: 'Apache Airflow',
              placeholder: 'user-or-org/dag-repo-name'
            }
          },
          github_branch: {
            title: 'GitHub or GitLab DAG Repository Branch',
            description:
              'Existing branch in the repository where DAGs are stored',
            type: 'string',
            uihints: {
              category: 'Apache Airflow'
            }
          },
          github_repo_token: {
            title: 'Personal Access Token',
            description:
              'Token that has permission to push to the DAG repository',
            type: 'string',
            uihints: {
              secure: true,
              category: 'Apache Airflow'
            }
          },
          cos_endpoint: {
            title: 'Cloud Object Storage Endpoint',
            description: 'The Cloud Object Storage endpoint',
            type: 'string',
            format: 'uri',
            uihints: {
              category: 'Cloud Object Storage',
              placeholder: 'https://your-cos-service:port'
            }
          },
          cos_bucket: {
            title: 'Cloud Object Storage Bucket Name',
            description: 'The Cloud Object Storage bucket name',
            type: 'string',
            pattern: '^[a-z0-9][a-z0-9-.]*[a-z0-9]$',
            minLength: 3,
            maxLength: 222,
            uihints: {
              category: 'Cloud Object Storage'
            }
          },
          cos_auth_type: {
            title: 'Cloud Object Storage Authentication Type',
            description:
              'Authentication type Elyra uses to authenticate with Cloud Object Storage',
            type: 'string',
            enum: [
              'AWS_IAM_ROLES_FOR_SERVICE_ACCOUNTS',
              'KUBERNETES_SECRET',
              'USER_CREDENTIALS'
            ],
            default: 'USER_CREDENTIALS',
            uihints: {
              field_type: 'dropdown',
              category: 'Cloud Object Storage'
            }
          },
          cos_secret: {
            title: 'Cloud Object Storage Credentials Secret',
            description:
              "Kubernetes secret that's defined in the specified user namespace, containing the Cloud Object Storage username and password. This property is required for authentication type KUBERNETES_SECRET.",
            type: 'string',
            uihints: {
              secure: true,
              category: 'Cloud Object Storage'
            }
          },
          cos_username: {
            title: 'Cloud Object Storage Username',
            description:
              'The Cloud Object Storage username. This property is required for authentication type USER_CREDENTIALS and KUBERNETES_SECRET.',
            type: 'string',
            uihints: {
              category: 'Cloud Object Storage'
            }
          },
          cos_password: {
            title: 'Cloud Object Storage Password',
            description:
              'The Cloud Object Storage password. This property is required for authentication type USER_CREDENTIALS and KUBERNETES_SECRET.',
            type: 'string',
            minLength: 8,
            uihints: {
              secure: true,
              category: 'Cloud Object Storage'
            }
          },
          tags: {
            title: 'Tags',
            description: 'Tags for categorizing Apache Airflow',
            type: 'array',
            uihints: {
              field_type: 'tags'
            }
          }
        },
        required: [
          'api_endpoint',
          'cos_endpoint',
          'cos_auth_type',
          'cos_bucket',
          'github_api_endpoint',
          'github_branch',
          'github_repo_token',
          'github_repo'
        ]
      }
    },
    required: ['schema_name', 'display_name', 'metadata']
  },
  {
    $schema:
      'https://raw.githubusercontent.com/elyra-ai/elyra/master/elyra/metadata/schemas/meta-schema.json',
    $id:
      'https://raw.githubusercontent.com/elyra-ai/elyra/master/elyra/metadata/schemas/kfp.json',
    title: 'Kubeflow Pipelines',
    name: 'kfp',
    schemaspace: 'runtimes',
    schemaspace_id: '130b8e00-de7c-4b32-b553-b4a52824a3b5',
    metadata_class_name: 'elyra.pipeline.kfp.kfp_metadata.KfpMetadata',
    runtime_type: 'KUBEFLOW_PIPELINES',
    uihints: {
      title: 'Kubeflow Pipelines runtimes',
      icon: 'elyra:runtimes',
      reference_url:
        'https://elyra.readthedocs.io/en/latest/user_guide/runtime-conf.html'
    },
    properties: {
      schema_name: {
        title: 'Schema Name',
        description: 'The schema associated with this instance',
        type: 'string',
        const: 'kfp'
      },
      display_name: {
        title: 'Display Name',
        description: 'Display name of this Kubeflow Pipelines configuration',
        type: 'string',
        minLength: 1
      },
      metadata: {
        description: 'Additional data specific to this metadata',
        type: 'object',
        properties: {
          runtime_type: {
            title: 'Runtime Type',
            description: 'The runtime associated with this instance',
            type: 'string',
            const: 'KUBEFLOW_PIPELINES',
            uihints: {
              hidden: true
            }
          },
          description: {
            title: 'Description',
            description: 'Description of this Kubeflow Pipelines configuration',
            type: 'string'
          },
          api_endpoint: {
            title: 'Kubeflow Pipelines API Endpoint',
            description: 'The Kubeflow Pipelines API endpoint',
            type: 'string',
            format: 'uri',
            uihints: {
              category: 'Kubeflow Pipelines',
              placeholder: 'https://your-kubeflow-service:port/pipeline'
            }
          },
          user_namespace: {
            title: 'Kubeflow Pipelines User Namespace',
            description:
              'The Kubeflow Pipelines user namespace used to create experiments',
            type: 'string',
            pattern: '^[a-z0-9][-a-z0-9]*[a-z0-9]$',
            maxLength: 63,
            uihints: {
              category: 'Kubeflow Pipelines'
            }
          },
          engine: {
            title: 'Kubeflow Pipelines engine',
            description: 'The Kubeflow Pipelines engine in use',
            type: 'string',
            enum: ['Argo', 'Tekton'],
            default: 'Argo',
            uihints: {
              field_type: 'dropdown',
              category: 'Kubeflow Pipelines'
            }
          },
          auth_type: {
            title: 'Authentication Type',
            description:
              'Authentication type Elyra uses to authenticate with Kubeflow',
            type: 'string',
            enum: [
              'NO_AUTHENTICATION',
              'KUBERNETES_SERVICE_ACCOUNT_TOKEN',
              'DEX_STATIC_PASSWORDS',
              'DEX_LDAP',
              'DEX_LEGACY'
            ],
            default: 'NO_AUTHENTICATION',
            uihints: {
              field_type: 'dropdown',
              category: 'Kubeflow Pipelines'
            }
          },
          api_username: {
            title: 'Kubeflow Pipelines API Endpoint Username',
            description:
              'The Kubeflow Pipelines API endpoint username. This property is required for all authentication types, except NO_AUTHENTICATION and KUBERNETES_SERVICE_ACCOUNT_TOKEN.',
            type: 'string',
            uihints: {
              category: 'Kubeflow Pipelines'
            }
          },
          api_password: {
            title: 'Kubeflow Pipelines API Endpoint Password',
            description:
              'Password for the specified username. This property is required for all authentication types, except NO_AUTHENTICATION and KUBERNETES_SERVICE_ACCOUNT_TOKEN.',
            type: 'string',
            uihints: {
              secure: true,
              category: 'Kubeflow Pipelines'
            }
          },
          cos_endpoint: {
            title: 'Cloud Object Storage Endpoint',
            description: 'The Cloud Object Storage endpoint',
            type: 'string',
            format: 'uri',
            uihints: {
              category: 'Cloud Object Storage',
              placeholder: 'https://your-cos-service:port'
            }
          },
          cos_bucket: {
            title: 'Cloud Object Storage Bucket Name',
            description: 'The Cloud Object Storage bucket name',
            type: 'string',
            pattern: '^[a-z0-9][a-z0-9-.]*[a-z0-9]$',
            minLength: 3,
            maxLength: 222,
            uihints: {
              category: 'Cloud Object Storage'
            }
          },
          cos_auth_type: {
            title: 'Cloud Object Storage Authentication Type',
            description:
              'Authentication type Elyra uses to authenticate with Cloud Object Storage',
            type: 'string',
            enum: [
              'AWS_IAM_ROLES_FOR_SERVICE_ACCOUNTS',
              'KUBERNETES_SECRET',
              'USER_CREDENTIALS'
            ],
            default: 'USER_CREDENTIALS',
            uihints: {
              field_type: 'dropdown',
              category: 'Cloud Object Storage'
            }
          },
          cos_secret: {
            title: 'Cloud Object Storage Credentials Secret',
            description:
              "Kubernetes secret that's defined in the specified user namespace, containing the Cloud Object Storage username and password. This property is required for authentication type KUBERNETES_SECRET.",
            type: 'string',
            uihints: {
              secure: true,
              category: 'Cloud Object Storage'
            }
          },
          cos_username: {
            title: 'Cloud Object Storage Username',
            description:
              'The Cloud Object Storage username. This property is required for authentication type USER_CREDENTIALS and KUBERNETES_SECRET.',
            type: 'string',
            uihints: {
              category: 'Cloud Object Storage'
            }
          },
          cos_password: {
            title: 'Cloud Object Storage Password',
            description:
              'The Cloud Object Storage password. This property is required for authentication type USER_CREDENTIALS and KUBERNETES_SECRET.',
            type: 'string',
            minLength: 8,
            uihints: {
              secure: true,
              category: 'Cloud Object Storage'
            }
          },
          tags: {
            title: 'Tags',
            description: 'Tags for categorizing Kubeflow pipelines',
            type: 'array',
            uihints: {
              field_type: 'tags'
            }
          }
        },
        required: [
          'api_endpoint',
          'cos_auth_type',
          'cos_endpoint',
          'cos_bucket'
        ]
      }
    },
    required: ['schema_name', 'display_name', 'metadata']
  }
];

export const expected_pipeline = {
  id: 'primary',
  nodes: [
    {
      id: 'bb889c69-b23a-484e-8fb3-e69309f38a98',
      type: 'execution_node',
      op: 'execute-notebook-node',
      app_data: {
        component_parameters: {
          filename: 'load_data.ipynb',
          runtime_image: 'docker.io/amancevice/pandas:1.1.1',
          outputs: ['data/noaa-weather-data-jfk-airport/jfk_weather.csv'],
          env_vars: [
            'DATASET_URL=https://dax-cdn.cdn.appdomain.cloud/dax-noaa-weather-data-jfk-airport/1.1.4/noaa-weather-data-jfk-airport.tar.gz'
          ],
          dependencies: [],
          include_subdirectories: false
        },
        label: 'Load weather data',
        ui_data: {
          label: 'Load weather data',
          image:
            'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20viewBox%3D%220%200%2022%2022%22%3E%0A%20%20%3Cg%20class%3D%22jp-icon-warn0%20jp-icon-selectable%22%20fill%3D%22%23EF6C00%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M18.7%203.3v15.4H3.3V3.3h15.4m1.5-1.5H1.8v18.3h18.3l.1-18.3z%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M16.5%2016.5l-5.4-4.3-5.6%204.3v-11h11z%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A',
          x_pos: 106,
          y_pos: 180.50000762939453,
          description: 'Run notebook file'
        }
      },
      inputs: [
        {
          id: 'inPort',
          app_data: {
            ui_data: {
              cardinality: {
                min: 0,
                max: -1
              },
              label: 'Input Port'
            }
          }
        }
      ],
      outputs: [
        {
          id: 'outPort',
          app_data: {
            ui_data: {
              cardinality: {
                min: 0,
                max: -1
              },
              label: 'Output Port'
            }
          }
        }
      ]
    },
    {
      id: '8c96e288-4461-4d7e-8e0d-353c1fdb0c8c',
      type: 'execution_node',
      op: 'execute-python-node',
      app_data: {
        component_parameters: {
          filename: 'Part 1 - Data Cleaning.ipynb',
          runtime_image: 'docker.io/amancevice/pandas:1.1.1',
          outputs: [
            'data/noaa-weather-data-jfk-airport/jfk_weather_cleaned.csv'
          ],
          env_vars: [],
          dependencies: [],
          include_subdirectories: false
        },
        label: '',
        ui_data: {
          label: 'Part 1 - Data Cleaning.ipynb',
          image:
            'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20viewBox%3D%220%200%2022%2022%22%3E%0A%20%20%3Cg%20class%3D%22jp-icon-warn0%20jp-icon-selectable%22%20fill%3D%22%23EF6C00%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M18.7%203.3v15.4H3.3V3.3h15.4m1.5-1.5H1.8v18.3h18.3l.1-18.3z%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M16.5%2016.5l-5.4-4.3-5.6%204.3v-11h11z%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A',
          x_pos: 383,
          y_pos: 180,
          description: 'Run notebook file'
        }
      },
      inputs: [
        {
          id: 'inPort',
          app_data: {
            ui_data: {
              cardinality: {
                min: 0,
                max: -1
              },
              label: 'Input Port'
            }
          },
          links: [
            {
              id: 'e3c17fe0-5b6b-460e-a48d-5b072cdb4749',
              node_id_ref: 'bb889c69-b23a-484e-8fb3-e69309f38a98',
              port_id_ref: 'outPort'
            }
          ]
        }
      ],
      outputs: [
        {
          id: 'outPort',
          app_data: {
            ui_data: {
              cardinality: {
                min: 0,
                max: -1
              },
              label: 'Output Port'
            }
          }
        }
      ]
    },
    {
      id: 'dcf486ef-2d73-4306-a3ca-af720a1f8eb3',
      type: 'execution_node',
      op: 'execute-r-node',
      app_data: {
        component_parameters: {
          filename: 'Part 2 - Data Analysis.ipynb',
          runtime_image: 'docker.io/amancevice/pandas:1.1.1',
          outputs: [],
          env_vars: [],
          dependencies: [],
          include_subdirectories: false
        },
        label: '',
        ui_data: {
          label: 'Part 2 - Data Analysis.ipynb',
          image:
            'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20viewBox%3D%220%200%2022%2022%22%3E%0A%20%20%3Cg%20class%3D%22jp-icon-warn0%20jp-icon-selectable%22%20fill%3D%22%23EF6C00%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M18.7%203.3v15.4H3.3V3.3h15.4m1.5-1.5H1.8v18.3h18.3l.1-18.3z%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M16.5%2016.5l-5.4-4.3-5.6%204.3v-11h11z%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A',
          x_pos: 657,
          y_pos: 119.00000762939453,
          description: 'Run notebook file'
        }
      },
      inputs: [
        {
          id: 'inPort',
          app_data: {
            ui_data: {
              cardinality: {
                min: 0,
                max: -1
              },
              label: 'Input Port'
            }
          },
          links: [
            {
              id: '99572430-47bd-49ba-b018-ab47708dc7af',
              node_id_ref: '8c96e288-4461-4d7e-8e0d-353c1fdb0c8c',
              port_id_ref: 'outPort'
            }
          ]
        }
      ],
      outputs: [
        {
          id: 'outPort',
          app_data: {
            ui_data: {
              cardinality: {
                min: 0,
                max: -1
              },
              label: 'Output Port'
            }
          }
        }
      ]
    },
    {
      id: '1e4b1763-337e-4f84-ae9c-a6cc79a1b7eb',
      type: 'execution_node',
      op: 'foo-bar',
      app_data: {
        component_parameters: {
          filename: 'Part 3 - Time Series Forecasting.ipynb',
          runtime_image: 'docker.io/amancevice/pandas:1.1.1',
          outputs: [],
          env_vars: [],
          dependencies: [],
          include_subdirectories: false
        },
        label: '',
        ui_data: {
          label: 'Part 3 - Time Series Forecasting.ipynb',
          image:
            'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20viewBox%3D%220%200%2022%2022%22%3E%0A%20%20%3Cg%20class%3D%22jp-icon-warn0%20jp-icon-selectable%22%20fill%3D%22%23EF6C00%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M18.7%203.3v15.4H3.3V3.3h15.4m1.5-1.5H1.8v18.3h18.3l.1-18.3z%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M16.5%2016.5l-5.4-4.3-5.6%204.3v-11h11z%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A',
          x_pos: 656,
          y_pos: 230,
          description: 'Run notebook file'
        }
      },
      inputs: [
        {
          id: 'inPort',
          app_data: {
            ui_data: {
              cardinality: {
                min: 0,
                max: -1
              },
              label: 'Input Port'
            }
          },
          links: [
            {
              id: 'ee7de711-33d1-4027-8b40-36f544b70703',
              node_id_ref: '8c96e288-4461-4d7e-8e0d-353c1fdb0c8c',
              port_id_ref: 'outPort'
            }
          ]
        }
      ],
      outputs: [
        {
          id: 'outPort',
          app_data: {
            ui_data: {
              cardinality: {
                min: 0,
                max: -1
              },
              label: 'Output Port'
            }
          }
        }
      ]
    }
  ],
  app_data: {
    ui_data: {
      comments: [
        {
          id: '00b250fb-d24c-4fa5-9df8-80d4d441d18a',
          x_pos: 30,
          y_pos: 30,
          width: 175,
          height: 42,
          class_name: 'd3-comment-rect',
          content: 'Download the data',
          associated_id_refs: [
            {
              node_ref: 'bb889c69-b23a-484e-8fb3-e69309f38a98'
            }
          ]
        },
        {
          id: 'f66b8ea3-056f-41da-a968-150d9e246c98',
          x_pos: 300.99998474121094,
          y_pos: 30,
          width: 175,
          height: 42,
          class_name: 'd3-comment-rect',
          content: 'Clean the data',
          associated_id_refs: [
            {
              node_ref: '8c96e288-4461-4d7e-8e0d-353c1fdb0c8c'
            }
          ]
        },
        {
          id: '06d0f895-ad45-4147-a200-edc5a88ddf68',
          x_pos: 564.9999847412109,
          y_pos: 30,
          width: 175,
          height: 42,
          class_name: 'd3-comment-rect',
          content: 'Analyze the data',
          associated_id_refs: [
            {
              node_ref: 'dcf486ef-2d73-4306-a3ca-af720a1f8eb3'
            }
          ]
        },
        {
          id: '16caa30a-2820-4fef-ba27-7ba61aac6306',
          x_pos: 564.9999847412109,
          y_pos: 329.00000762939453,
          width: 175,
          height: 59,
          class_name: 'd3-comment-rect',
          content: 'Explore approaches to predicting future temperatures',
          associated_id_refs: [
            {
              node_ref: '1e4b1763-337e-4f84-ae9c-a6cc79a1b7eb'
            }
          ]
        }
      ]
    },
    version: 7,
    properties: {
      name: 'hello-generic-world',
      runtime: 'Generic',
      description: 'A generic pipeline tutorial'
    }
  },
  runtime_ref: ''
};

export const expected_pipeline_json = {
  doc_type: 'pipeline',
  version: '3.0',
  json_schema:
    'http://api.dataplatform.ibm.com/schemas/common-pipeline/pipeline-flow/pipeline-flow-v3-schema.json',
  id: 'elyra-auto-generated-pipeline',
  primary_pipeline: 'primary',
  pipelines: [
    {
      id: 'primary',
      nodes: [
        {
          id: 'bb889c69-b23a-484e-8fb3-e69309f38a98',
          type: 'execution_node',
          op: 'execute-notebook-node',
          app_data: {
            component_parameters: {
              filename:
                // need to fix this, copy the object from changing
                'load_data.ipynb',
              runtime_image: 'docker.io/amancevice/pandas:1.1.1',
              outputs: ['data/noaa-weather-data-jfk-airport/jfk_weather.csv'],
              env_vars: [
                'DATASET_URL=https://dax-cdn.cdn.appdomain.cloud/dax-noaa-weather-data-jfk-airport/1.1.4/noaa-weather-data-jfk-airport.tar.gz'
              ],
              dependencies: [],
              include_subdirectories: false
            },
            label: 'Load weather data',
            ui_data: {
              label: 'Load weather data',
              image:
                'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20viewBox%3D%220%200%2022%2022%22%3E%0A%20%20%3Cg%20class%3D%22jp-icon-warn0%20jp-icon-selectable%22%20fill%3D%22%23EF6C00%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M18.7%203.3v15.4H3.3V3.3h15.4m1.5-1.5H1.8v18.3h18.3l.1-18.3z%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M16.5%2016.5l-5.4-4.3-5.6%204.3v-11h11z%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A',
              x_pos: 106,
              y_pos: 180.50000762939453,
              description: 'Run notebook file'
            }
          },
          inputs: [
            {
              id: 'inPort',
              app_data: {
                ui_data: {
                  cardinality: {
                    min: 0,
                    max: -1
                  },
                  label: 'Input Port'
                }
              }
            }
          ],
          outputs: [
            {
              id: 'outPort',
              app_data: {
                ui_data: {
                  cardinality: {
                    min: 0,
                    max: -1
                  },
                  label: 'Output Port'
                }
              }
            }
          ]
        },
        {
          id: '8c96e288-4461-4d7e-8e0d-353c1fdb0c8c',
          type: 'execution_node',
          op: 'execute-notebook-node',
          app_data: {
            component_parameters: {
              filename: 'Part 1 - Data Cleaning.ipynb',
              runtime_image: 'docker.io/amancevice/pandas:1.1.1',
              outputs: [
                'data/noaa-weather-data-jfk-airport/jfk_weather_cleaned.csv'
              ],
              env_vars: [],
              dependencies: [],
              include_subdirectories: false
            },
            label: '',
            ui_data: {
              label: 'Part 1 - Data Cleaning.ipynb',
              image:
                'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20viewBox%3D%220%200%2022%2022%22%3E%0A%20%20%3Cg%20class%3D%22jp-icon-warn0%20jp-icon-selectable%22%20fill%3D%22%23EF6C00%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M18.7%203.3v15.4H3.3V3.3h15.4m1.5-1.5H1.8v18.3h18.3l.1-18.3z%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M16.5%2016.5l-5.4-4.3-5.6%204.3v-11h11z%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A',
              x_pos: 383,
              y_pos: 180,
              description: 'Run notebook file'
            }
          },
          inputs: [
            {
              id: 'inPort',
              app_data: {
                ui_data: {
                  cardinality: {
                    min: 0,
                    max: -1
                  },
                  label: 'Input Port'
                }
              },
              links: [
                {
                  id: 'e3c17fe0-5b6b-460e-a48d-5b072cdb4749',
                  node_id_ref: 'bb889c69-b23a-484e-8fb3-e69309f38a98',
                  port_id_ref: 'outPort'
                }
              ]
            }
          ],
          outputs: [
            {
              id: 'outPort',
              app_data: {
                ui_data: {
                  cardinality: {
                    min: 0,
                    max: -1
                  },
                  label: 'Output Port'
                }
              }
            }
          ]
        },
        {
          id: 'dcf486ef-2d73-4306-a3ca-af720a1f8eb3',
          type: 'execution_node',
          op: 'execute-notebook-node',
          app_data: {
            component_parameters: {
              filename: 'Part 2 - Data Analysis.ipynb',
              runtime_image: 'docker.io/amancevice/pandas:1.1.1',
              outputs: [],
              env_vars: [],
              dependencies: [],
              include_subdirectories: false
            },
            label: '',
            ui_data: {
              label: 'Part 2 - Data Analysis.ipynb',
              image:
                'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20viewBox%3D%220%200%2022%2022%22%3E%0A%20%20%3Cg%20class%3D%22jp-icon-warn0%20jp-icon-selectable%22%20fill%3D%22%23EF6C00%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M18.7%203.3v15.4H3.3V3.3h15.4m1.5-1.5H1.8v18.3h18.3l.1-18.3z%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M16.5%2016.5l-5.4-4.3-5.6%204.3v-11h11z%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A',
              x_pos: 657,
              y_pos: 119.00000762939453,
              description: 'Run notebook file'
            }
          },
          inputs: [
            {
              id: 'inPort',
              app_data: {
                ui_data: {
                  cardinality: {
                    min: 0,
                    max: -1
                  },
                  label: 'Input Port'
                }
              },
              links: [
                {
                  id: '99572430-47bd-49ba-b018-ab47708dc7af',
                  node_id_ref: '8c96e288-4461-4d7e-8e0d-353c1fdb0c8c',
                  port_id_ref: 'outPort'
                }
              ]
            }
          ],
          outputs: [
            {
              id: 'outPort',
              app_data: {
                ui_data: {
                  cardinality: {
                    min: 0,
                    max: -1
                  },
                  label: 'Output Port'
                }
              }
            }
          ]
        },
        {
          id: '1e4b1763-337e-4f84-ae9c-a6cc79a1b7eb',
          type: 'execution_node',
          op: 'execute-notebook-node',
          app_data: {
            component_parameters: {
              filename: 'Part 3 - Time Series Forecasting.ipynb',
              runtime_image: 'docker.io/amancevice/pandas:1.1.1',
              outputs: [],
              env_vars: [],
              dependencies: [],
              include_subdirectories: false
            },
            label: '',
            ui_data: {
              label: 'Part 3 - Time Series Forecasting.ipynb',
              image:
                'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20viewBox%3D%220%200%2022%2022%22%3E%0A%20%20%3Cg%20class%3D%22jp-icon-warn0%20jp-icon-selectable%22%20fill%3D%22%23EF6C00%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M18.7%203.3v15.4H3.3V3.3h15.4m1.5-1.5H1.8v18.3h18.3l.1-18.3z%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M16.5%2016.5l-5.4-4.3-5.6%204.3v-11h11z%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A',
              x_pos: 656,
              y_pos: 230,
              description: 'Run notebook file'
            }
          },
          inputs: [
            {
              id: 'inPort',
              app_data: {
                ui_data: {
                  cardinality: {
                    min: 0,
                    max: -1
                  },
                  label: 'Input Port'
                }
              },
              links: [
                {
                  id: 'ee7de711-33d1-4027-8b40-36f544b70703',
                  node_id_ref: '8c96e288-4461-4d7e-8e0d-353c1fdb0c8c',
                  port_id_ref: 'outPort'
                }
              ]
            }
          ],
          outputs: [
            {
              id: 'outPort',
              app_data: {
                ui_data: {
                  cardinality: {
                    min: 0,
                    max: -1
                  },
                  label: 'Output Port'
                }
              }
            }
          ]
        }
      ],
      app_data: {
        ui_data: {
          comments: [
            {
              id: '00b250fb-d24c-4fa5-9df8-80d4d441d18a',
              x_pos: 30,
              y_pos: 30,
              width: 175,
              height: 42,
              class_name: 'd3-comment-rect',
              content: 'Download the data',
              associated_id_refs: [
                {
                  node_ref: 'bb889c69-b23a-484e-8fb3-e69309f38a98'
                }
              ]
            },
            {
              id: 'f66b8ea3-056f-41da-a968-150d9e246c98',
              x_pos: 300.99998474121094,
              y_pos: 30,
              width: 175,
              height: 42,
              class_name: 'd3-comment-rect',
              content: 'Clean the data',
              associated_id_refs: [
                {
                  node_ref: '8c96e288-4461-4d7e-8e0d-353c1fdb0c8c'
                }
              ]
            },
            {
              id: '06d0f895-ad45-4147-a200-edc5a88ddf68',
              x_pos: 564.9999847412109,
              y_pos: 30,
              width: 175,
              height: 42,
              class_name: 'd3-comment-rect',
              content: 'Analyze the data',
              associated_id_refs: [
                {
                  node_ref: 'dcf486ef-2d73-4306-a3ca-af720a1f8eb3'
                }
              ]
            },
            {
              id: '16caa30a-2820-4fef-ba27-7ba61aac6306',
              x_pos: 564.9999847412109,
              y_pos: 329.00000762939453,
              width: 175,
              height: 59,
              class_name: 'd3-comment-rect',
              content: 'Explore approaches to predicting future temperatures',
              associated_id_refs: [
                {
                  node_ref: '1e4b1763-337e-4f84-ae9c-a6cc79a1b7eb'
                }
              ]
            }
          ]
        },
        version: 7,
        properties: {
          name: 'hello-generic-world',
          runtime: 'Generic',
          description: 'A generic pipeline tutorial'
        },
        name: 'hello-generic-world',
        source: 'hello-generic-world.pipeline',
        runtime_config: 'kfp-local'
      },
      runtime_ref: ''
    }
  ],
  schemas: []
};
