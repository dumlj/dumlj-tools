export const fetchCheck = async (url: string): Promise<void> => {
  const res = await fetch(url)
  if (!res?.ok) return Promise.reject(new Error(`${url} is not alive`))
}

export class CheckAliveManager {
  private checkAliveResultMap = new Map<string, Promise<boolean>>()
  protected async getCheckAliveResult(url: string, ignoreCache?: boolean, key?: string, checkAlive?: () => Promise<boolean>) {
    try {
      if (key && checkAlive) {
        if (!this.checkAliveResultMap.has(key) || ignoreCache) this.checkAliveResultMap.set(key, checkAlive())
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const res = await this.checkAliveResultMap.get(key)!
        return res
      }
      await fetchCheck(url)
      return true
    } catch (e) {
      return false
    }
  }
  clearCheckAliveResult(key?: string) {
    if (key) {
      this.checkAliveResultMap.delete(key)
    } else {
      this.checkAliveResultMap.clear()
    }
  }
}
