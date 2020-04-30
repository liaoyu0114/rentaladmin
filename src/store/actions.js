

export default {
  setUserInfoPromise(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit("setUserInfo", payload)
      resolve()
    })
  }
}
