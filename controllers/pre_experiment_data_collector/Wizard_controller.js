WizardController = MVC.Controller.extend('Wizard',
    /* @Static */
    {
        wizard: null,
        /**
         *
         * @return a new WizardEngine instance
         */
        newWizardEngine: function () {
            this.wizard = new WizardEngine("Wizard", "PreExperiment Data Collector");
            return this.wizard;
        },
        initialize: function () {
            this.wizard.initialize();
        }
    },
    /* @Prototype */
    {
        "Wizard.submit subscribe": function () {
            this.Class.wizard.$element.wizard('select', 0);
        }
    }
);