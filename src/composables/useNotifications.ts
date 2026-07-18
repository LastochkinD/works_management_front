import { useMessage } from 'naive-ui'

export const useNotifications = () => {
  const message = useMessage()

  const success = (msg: string) => {
    message.success(msg)
  }

  const error = (msg: string) => {
    message.error(msg)
  }

  const warning = (msg: string) => {
    message.warning(msg)
  }

  const info = (msg: string) => {
    message.info(msg)
  }

  return {
    success,
    error,
    warning,
    info
  }
}

export default useNotifications
