class VendingManchine {
    constructor() {
        this.demos = [500, 200, 100, 50, 20, 10, 5, 2,1];

        this.product = [
            {
                id: 1,
                name: 'water',
                price: 30
            },
        ];

        this.selectProduct = null;
    }

    restock(product) {
        const isOccupied = this.product.find(item => item.id == product.id)
        
        if (isOccupied) {
            return {
                ok: false,
                message: 'Given slot is busy, pls choose another slot',
            }
        }

        this.product.push(product);

        return{
            ok: true,
            message: "Product has been added"
        }
    }
    
    selectProduct(id){
        const product = this.product.find((item) => item.id == id)
        
        if(!product){
            return{
                ok: false,
                message: "Unknow Product"
            };
        }

        this.selectProduct = product 

        return{
            ok: true,
            message: 'Pls insert the coins',
        };
    }
}


const vm = new VendingManchine();

// const message = vm.restock({
//     id:2,
//     name: 'Water',
//     price: 30
// })

// console.log(message);

// console.log(vm);

