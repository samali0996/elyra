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
