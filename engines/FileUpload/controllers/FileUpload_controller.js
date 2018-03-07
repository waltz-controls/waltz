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
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @date 17.02.12
 */
//TODO make stateful
FileUploadController = MVC.Controller.extend('FileUpload', {
    init: function () {
        window.fileUploadErrors = {
            maxFileSize: 'File is too big',
            minFileSize: 'File is too small',
            acceptFileTypes: 'Filetype not allowed',
            maxNumberOfFiles: 'Max number of files exceeded',
            uploadedBytes: 'Uploaded bytes exceed file size',
            emptyResult: 'Empty file upload result'
        };
        this._super();
    }
}, {
    "FileUpload.initialize subscribe": function (params) {
        this.data = params.data;
        this.render({to: this.data.element(), action: 'initialize'});
        $(this.data.element()).fileupload(
            {
                sequentialUploads: true,
                autoUpload: true,
                //avoid authentication issues with ajax requests
                forceIframeTransport: true
            }
        );
    },
    /**
     * Expects the following:
     * params.data - an array of file objects,
     * each file object:
     * {
     *   name,
     *   thumbnail,
     *   url,
     *   size
     * }
     * params.id - an id of the file upload on the page
     *
     * @param params
     */
    "FileUpload.add_files subscribe": function (params) {
        this.data = {};
        this.data.id = params.id;
        this.data.files = params.data;
        //TODO get this function from the jquery.file.upload widget
        this.data.formatFileSize = function () {
            return "Unknown";
        };

        this.render({action: 'template-download', to: $('tbody.files', $('#' + this.data.id))[0]})
    }
});
