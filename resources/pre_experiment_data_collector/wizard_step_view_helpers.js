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
 * Created by
 * User: khokhria
 * Date: 12.01.12
 */
;WizardStepViewHelpers =  {
    printField:function (ndx, field, values) {
        if (field.visibility.toLowerCase() != 'web') {
            return "";
        }
        var data = MVC.Object.extend({}, field);
        data.values = values;
        return new View({ url:'views/pre_experiment_data_collector/wizard.step.field.ejs' }).render(data,this);
    },
    printForm:function (ndx, form, values) {
        var data = MVC.Object.extend({}, form);
        data.values = values;
        return new View({ url:'views/pre_experiment_data_collector/wizard.step.' + form.type + '.ejs' }).render(data,this);
    },
    isRequired:function (validation) {
        return validation != null && validation.contains('required');
    },
    printAsterisk:function (validation) {
        if (this.isRequired(validation)) {
            return "*"
        } else {
            return "";
        }
    },
    printInput:function (type, id, validation, readonly, values) {
        var className = (function (v) {
            var className = [];
            className.push("validate[");
            className.push(v);
            className.push("]");
            if (readonly) {
                className.push(" ui-state-disabled");
            }
            return className.join('');
        })(validation);

        var options = {};
        if (readonly) {
            options.readonly = true;
        }
        options.klass = className;

        var value = values[id] ? values[id] : '';
        switch (type.toLowerCase()) {
            case 'text':
                options.size = "17 x 5";
                return this.text_area_tag(id, value, options);
            case 'file_multiply':
                options.klass += ' multi ';
                options.multiple = true;
            case 'file':
                options.linkId = id;
                return this.file_tag(id, '', options) + this.hidden_field_tag(id, '', {}) + this.single_tag_for('div', { id:id + "-list" });
            case 'string':
            case 'number':
            default:
                var inputType = 'text';
                return this.input_field_tag(id, value, inputType, options);
        }
    }
};
