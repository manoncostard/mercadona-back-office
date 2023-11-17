class ProductFormValidator {
    
    constructor() {
        this.titleInput = document.getElementById('title');
        this.categorySelect = document.getElementById('category');
        this.descriptionTextarea = document.getElementById('description');
        this.priceInput = document.getElementById('price');
        this.pictureInput = document.getElementById('picture');

        // Event Listeners
        this.titleInput.addEventListener('blur', this.validateTitle.bind(this));
        this.categorySelect.addEventListener('blur', this.validateCategory.bind(this));
        this.descriptionTextarea.addEventListener('blur', this.validateDescription.bind(this));
        this.priceInput.addEventListener('blur', this.validatePrice.bind(this));
        this.pictureInput.addEventListener('change', this.validatePicture.bind(this));
    }

    validateTitle() {
        const title = this.titleInput.value;
        if (title.length > 50) {
            this.titleInput.value = this.titleInput.value.slice(0, 50);
        }
        if(title.length < 1) {
            document.getElementById('title').classList.add("invalid")
            return false;
        }
        document.getElementById('title').classList.remove("invalid")
        return true;
    }

    validateCategory() {
        const category = this.categorySelect.value;
        if (category == 'Choose Category' || category == null) {
            document.getElementById('category').classList.add("invalid")
            return false;
        }
        document.getElementById('category').classList.remove("invalid")
        return true;
    }

    validateDescription() {
        const description = this.descriptionTextarea.value;
        if (description.length > 100) {
            let newValue = this.descriptionTextarea.value.slice(0, 100)
            this.descriptionTextarea.value = newValue;
            document.getElementById('description').classList.add("invalid")
            return false;
        }
        if (description.length < 2) {
            document.getElementById('description').classList.add("invalid")
            return false;
        }
        document.getElementById('description').classList.remove("invalid")
        return true;
    }

    validatePrice() {
        const price = this.priceInput.value;
        if (isNaN(price) || parseFloat(price) <= 0) {
            document.getElementById('price').classList.add("invalid")
            return false;
        }
        this.priceInput.value = parseFloat(price).toFixed(2)
        document.getElementById('price').classList.remove("invalid")
        return true;
    }

    validatePicture() {
        let currentPicture = document.getElementById("currentFileUrl")
        let file = this.pictureInput.files[0];
        const allowedFileTypes = ['image/png', 'image/jpeg']

        if(!this.pictureInput.files[0] && currentPicture.innerText == "") {
            document.getElementById('picture').classList.add("invalid")
            return false;
        } else if(this.pictureInput.files[0]) {
            let file = this.pictureInput.files[0];
            let fileType = file.type
            if(file.size > 1000000){
                alert("File is too big!");
                this.pictureInput.value = "";
                return false;
            } else if (!allowedFileTypes.includes(fileType)) {
                alert("File type not supported!");
                this.pictureInput.value = "";
                document.getElementById('picture').classList.add("invalid")
                return false;
            }     
        }
        document.getElementById('picture').classList.remove("invalid")
        return true;
    }

    validateForm() {
        return (
            this.validateTitle() &&
            this.validateCategory() &&
            this.validateDescription() &&
            this.validatePrice() &&
            this.validatePicture()
        );
    }
}

