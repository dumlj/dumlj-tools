import { ServiceConfig } from '@/config'
import { RejectError } from '.'

export const cancelErrorHandler = async (rejection: any) => {
  if (RejectError.isCancelOrAbsorbed(rejection)) {
    throw new RejectError(ServiceConfig.errorMessages.CANCELED, rejection)
  }
}

export const sendFailErrorHandler = async (rejection: any) => {
  if (!rejection || rejection.response?.status === 0) throw new RejectError(ServiceConfig.errorMessages.SEND_FAIL, rejection)
}

export const networkErrorHandler = async (rejection: any) => {
  if (rejection?.message?.includes('Network Error')) {
    throw new RejectError(ServiceConfig.errorMessages.NETWORK_ERROR, rejection)
  }
}

export const timeoutErrorHandler = async (rejection: any) => {
  if (rejection?.message?.includes('timeout of')) {
    throw new RejectError(ServiceConfig.errorMessages.TIMEOUT, rejection)
  }
}

export const status404ErrorHandler = async (rejection: any) => {
  const { status, method, message } = formatRejection(rejection)

  if (status !== 404) return
  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    throw new RejectError(ServiceConfig.errorMessages.POST_404, rejection)
  }
  throw new RejectError(message || ServiceConfig.errorMessages.GET_404, rejection)
}

export const status410ErrorHandler = async (rejection: any) => {
  const { status, message } = formatRejection(rejection)
  if (status !== 410) return
  throw new RejectError(message || ServiceConfig.errorMessages.STATUS_410, rejection)
}
export const status433ErrorHandler = async (rejection: any) => {
  const { status, message } = formatRejection(rejection)
  if (status !== 433) return
  throw new RejectError(message || ServiceConfig.errorMessages.STATUS_433, rejection)
}

export const serviceErrorHandler = async (rejection: any) => {
  const { status, message } = formatRejection(rejection)
  if (status >= 500 && status < 600) throw new RejectError(message || ServiceConfig.errorMessages.SERVICE_ERROR, rejection)
}

export const unknownErrorHandler = async (rejection: any) => {
  const { status, message } = formatRejection(rejection)
  if (status === undefined) throw new RejectError(message || ServiceConfig.errorMessages.UNKNOWN_ERROR, rejection)
}

function formatRejection(rejection: any) {
  const {
    status,
    config,
    data: response,
  } = rejection?.response || {
    status: undefined,
    config: undefined,
    data: undefined,
  }
  const method = (config?.method || '').toUpperCase()
  const message = response?.msg || response?.message
  return {
    status,
    method,
    message,
  }
}
