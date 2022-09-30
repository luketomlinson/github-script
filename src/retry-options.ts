import * as core from '@actions/core'
import {OctokitOptions} from '@octokit/core/dist-types/types'
import {RequestRequestOptions} from '@octokit/types'

export type RetryOptions = {
  doNotRetry?: number[]
  enabled?: boolean
}

export function getRetryOptions(
  retries: number,
  exemptStatusCodes: number[],
  defaultOptions: OctokitOptions
): [RetryOptions, RequestRequestOptions | undefined] {
  if (retries <= 0) {
    return [{enabled: false}, defaultOptions.request]
  }

  const retryOptions: RetryOptions = {
    enabled: true
  }

  if (exemptStatusCodes.length > 0) {
    retryOptions.doNotRetry = exemptStatusCodes
  }

  const requestOptions: RequestRequestOptions = {
    ...defaultOptions.request,
    retries
  }

  core.debug(
    `GitHub client configured with: (retries: ${
      requestOptions.retries
    }, retry-exempt-status-code: ${
      retryOptions?.doNotRetry ?? 'octokit default: [400, 401, 403, 404, 422]'
    })`
  )

  return [retryOptions, requestOptions]
}

export function parseNumberArray(listString: string): number[] {
  if (!listString) {
    return []
  }

  const split = listString.trim().split(',')
  return split.map(x => parseInt(x))
}
