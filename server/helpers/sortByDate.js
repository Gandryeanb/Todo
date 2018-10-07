const Sorter = (arr, param) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (param === 'dsc') {
        if (arr[i].dueDate > arr[j].dueDate) {
          let y = arr[i]
          arr[i] = arr[j]
          arr[j] = y
        }
      } else {
        if (arr[i].dueDate < arr[j].dueDate) {
          let y = arr[i]
          arr[i] = arr[j]
          arr[j] = y
        }
      }
    }
  }
  return arr
}

export default Sorter