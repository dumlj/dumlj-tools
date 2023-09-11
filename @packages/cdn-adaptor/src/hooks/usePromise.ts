import React from 'react'

export const usePromise = <T>(promise: Promise<T>, defaultValue: T) => {
  const [value, setValue] = React.useState<T>(defaultValue)

  React.useEffect(() => {
    promise.then(setValue)
  }, [promise])

  return value
}
