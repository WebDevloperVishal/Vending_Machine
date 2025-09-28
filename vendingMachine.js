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
}

const vm = new VendingManchine()

const message = vm.restock({
    id:1,
    name: 'Water',
    price: 30
})

console.log(message);

console.log(vm);

