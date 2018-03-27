/*
 * The main contributor to this project is Institute of Materials Research,
 * Helmholtz-Zentrum Geesthacht,
 * Germany.
 *
 * This project is a contribution of the Helmholtz Association Centres and
 * Technische Universitaet Muenchen to the ESS Design Update Phase.
 *
 * The project's funding reference is FKZ05E11CG1.
 *
 * Copyright (c) 2012. Institute of Materials Research,
 * Helmholtz-Zentrum Geesthacht,
 * Germany.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA
 */

/**
 * Only one instance of this controller is allowed per application.
 */
WizardEngine = MVC.Controller.Stateful.extend('Wizard',
    /* @Prototype */
    {
        title: "Basic Wizard With Progress Bar",
        $element: null, //jQuery object that contains wizard wrapper
        $back: null,
        $next: null,
        options: null,
        isInitialized: false,
        forms: [],
        defaultOptions: function () {
            var wizard_controller = this;
            return {
                submit: ".submit",
                afterSelect: function (event, state) {
                    $("#progressbar").progressbar("value", state.percentComplete);
                    $("#location").text("(" + state.stepsComplete + "/" + state.stepsPossible + ")");
                },
                stepsWrapper: "#wizard-steps",
                beforeForward: function (event, state) {
                    var wizardStep = wizard_controller.forms[state.stepIndex - 1];
                    var isValid = wizardStep.validate ? wizardStep.validate() : true;
                    if (isValid) {
                        //storing the data in the model object
                        if(wizardStep.update) wizardStep.update();
                        //allow user to move forward
                        return true;
                    } else {
                        //prevent user from moving forward
                        return false;
                    }
                },
                afterForward: function (event, state) {
                    if (window.location.hash) {
                        window.location.hash = "#" + state.stepIndex;//+ "@" + elementId;
                    } else {
                        window.location += "#" + state.stepIndex;//+ "@" + elementId;
                    }
                    //workaround for Jquery-ui accordion height set to zero issue
                    //see http://forum.jquery.com/topic/accordion-height-set-to-zero-issue
                    //"You must have the accordion visible when the height is calculated" [Scott Gonzales].
                    $('div.accordion', state.step).accordion({
                        /**
                         * Set active tab to true, other - false.
                         *
                         * @param event
                         * @param ui
                         */
                        create: function (event, ui) {
                            var id = $('h3[tabindex=0]', $(this)).attr('choice-id');
                            $('#' + id, $(this)).val(true);

                            $('h3[tabindex=-1]', $(this)).each(function () {
                                var id = $(this).attr('choice-id');
                                $('#' + id).val(false);
                            });
                        },
                        /**
                         * Exchange tab values: newActive -> true, oldActive -> false
                         *
                         * @param event
                         * @param ui
                         */
                        change: function (event, ui) {
                            $('#' + ui.oldHeader.attr('choice-id'), ui.oldContent).val(false);

                            $('#' + ui.newHeader.attr('choice-id'), ui.newContent).val(true);
                        }
                    });

                    var wizardStep = wizard_controller.forms[state.stepIndex];
                    if(wizardStep.activate) wizardStep.activate();
                },
                afterBackward: function (event, state) {
                    if (window.location.hash) {
                        window.location.hash = "#" + state.stepIndex;//+ "@" + elementId;
                    } else {
                        window.location += "#" + state.stepIndex;//+"@"+ elementId;
                    }
                }
            }
        },
        submitHandler: function (params) {
            Controller.publish("Wizard.submit", params);
        },
        /**
         * Creates new wizard instance. Before further usage newly created instance should be initialized via initialize([]) method.
         *
         * @param elementId an id of the wrapper element on the main page, i.e. <div id="myWizard"></div>
         * @param title of this Wizard instance. Appears on the page up to progressbar.
         * @param options
         * @param submitHandler custom handler for submit button
         */
        init: function (elementId, title, options, submitHandler) {
            if (!document.getElementById(elementId)) {
                throw 'Wizard#init(elementId,options): elementId can not be null';
            }

            this._super(MVC.$E(elementId));

            this.options = MVC.Object.extend(this.defaultOptions(),options);

            this.title = title || this.title;
            this.submitHandler = submitHandler || this.submitHandler;
            this.$element = $(this.element);
        },
        /**
         * Finalizes instance creation. Returns itself for convenience.
         *
         * @param data an array of form objects: {id,toHtml()}. Overrides this instance forms collection.
         */
        initialize: function () {
            this.render({
                to: this.element,
                action: 'initialize'
            });

            $("#progressbar").progressbar();

            //initialize jQuery.wizard
            this.$element.wizard(this.options);
            this.$back = $("button.backward", this.$element);
            this.$next = $("button.forward", this.$element);
            this.isInitialized = true;
            return this;
        },
        "button.forward click": function (params) {
            if (!this.isInitialized) {
                throw "Wizard instance was not initialized. Call Wizard.initialize(data) first."
            }
        },
        "button.backward click": function (params) {
            if (!this.isInitialized) {
                throw "Wizard instance was not initialized. Call Wizard.initialize(data) first."
            }
        },
        "button.submit click": function (params) {
            if (!this.isInitialized) {
                throw "Wizard instance was not initialized. Call Wizard.initialize(data) first."
            }
            this.submitHandler(params);
        },
        /**
         * Adds a form to the instance forms collection. Returns itself for convenience.
         *
         * Call this method before initialization to override forms to be rendered.
         *
         * @param form {id,toHtml()}
         */
        addForm: function (form) {
            if (typeof form["toHtml"] != 'function')
                throw "form does not have toHtml function";
            this.forms.push(form);
            return this;
        }
    }
);