
function getFetch(){
  let inputVal = document.getElementById('barcode').value 

  if(inputVal.length !== 12) {
    alert(`Please ensure that the UPC code is 12 characters long!`)
    return;
  }
 
  const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json` //

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        if (data.status === 1) {
          const item = new ProductInfo (data.product) 
          item.showInfo()
          item.listIngredients()
        } else if (data.status === 0) {
          alert(`Product ${inputVal} not found. Please try another`)
        }
      })

      .catch(err => {
          console.log(`error ${err}`)
      });
}

class ProductInfo {
  constructor(productData) { //I am passing in data.product 
    this.name = productData.product_name // drilling into product_name like a folder pathway
    this.ingredients = productData.ingredients
    this.image = productData.image_url
  } 

  showInfo() {
    document.getElementById('product-img').src = this.image
    document.getElementById('product-name').innerText = this.name
  }

  listIngredients() { //explanation @ 3hr39min
    let tableRef = document.getElementById('ingredient-table') //targeting html
    for ( let i = 1; i < tableRef.rows.length;) { //any existing rows are deleted with loop
      tableRef.deleteRow(i)
    }

    for (let key in this.ingredients) { 
        let newRow = tableRef.insertRow(-1) //-1 to put something at an end of an array like push()
        let newICell = newRow.insertCell(0)
        let newVCell = newRow.insertCell(1)
        let newIText = document.createTextNode(this.ingredients[key].text)

        let vegStatus = this.ingredients[key].vegetarian
        let newVText = document.createTextNode(vegStatus)
        newICell.appendChild(newIText)
        newVCell.appendChild(newVText)
    }
  }
}

