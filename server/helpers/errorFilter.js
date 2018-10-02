export default {
  errSignUp (errMsg) {
    let arrErr = errMsg.split(',')
    let arrErrFiltered = []
    arrErr.forEach(errMsg => {
      arrErrFiltered.push(errMsg.split(':')[1])
    })
    return arrErrFiltered
  }
}