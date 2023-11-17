class PromoFormValidator {
    
    constructor() {
        this.startDateInput = document.getElementById('startDate');
        this.endDateInput = document.getElementById('endDate');
        this.reductionInput = document.getElementById('reduction');

        // Event Listeners
        this.reductionInput.addEventListener('blur', this.validateReduction.bind(this));
    }

    validateStartDate() {
        const startDate = this.startDateInput.value;
        if (startDate == "") {
            document.getElementById('startDate').classList.add("invalid")
            return false;
        }
        document.getElementById('startDate').classList.remove("invalid")
        return true;
    }
    validateEndDate() {
        const endDate = this.endDateInput.value;
        if (endDate == "" ) {
            document.getElementById('endDate').classList.add("invalid")
            return false;
        }
        document.getElementById('endDate').classList.remove("invalid")
        return true;
    }
    validateReduction() {
        const reduction = this.reductionInput.value;
        if (isNaN(reduction) || reduction <= 0 || reduction >= 100) {
            document.getElementById('reduction').classList.add("invalid")
            return false;
        }
        document.getElementById('reduction').classList.remove("invalid")
        return true;
    }

    
    validateForm() {
        return (
            this.validateStartDate() &&
            this.validateEndDate() &&
            this.validateReduction()
        );
    }
}

