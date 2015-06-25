/* global OC, OCA, FileList, $, t */
var GalleryButton = {};
GalleryButton.isPublic = false;
GalleryButton.button = {};
GalleryButton.url = null;

/**
 * Rebuilds the Gallery URL every time the files list has changed
 */
GalleryButton.onFileListUpdated = function () {
	"use strict";
	var fileList;

	if (GalleryButton.isPublic) {
		fileList = OCA.Sharing.PublicApp.fileList;
	} else {
		fileList = FileList;
	}

	GalleryButton.buildGalleryUrl(fileList.getCurrentDirectory().replace(/^\//, ''));
};

/**
 * Builds the URL which will load the exact same folder in Gallery
 *
 * @param dir
 */
GalleryButton.buildGalleryUrl = function (dir) {
	"use strict";
	var params = {};
	var tokenPath = '';
	var sharingTokenElement = $('#sharingToken');
	var token = (sharingTokenElement.val()) ? sharingTokenElement.val() : false;
	if (token) {
		params.token = token;
		tokenPath = 's/{token}';
	}
	GalleryButton.url =
		OC.generateUrl('apps/galleryplus/' + tokenPath, params) + '#' + encodeURIComponent(dir);
};

$(document).ready(function () {
		"use strict";
		if ($('#body-login').length > 0) {
			return true; //deactivate on login page
		}

		if ($('html').is('.ie8')) {
			return true; //deactivate in IE8
		}

		if ($('#isPublic').val()) {
			GalleryButton.isPublic = true;
		}

		if ($('#filesApp').val()) {

			$('#fileList').on('updated', GalleryButton.onFileListUpdated);

			// Toggle for opening files list as gallery view
			GalleryButton.button =
				$('<div class="button view-switcher left-switch-button disabled-button">' +
					'<img class="svg" src="' + OC.imagePath('core', 'actions/toggle-filelist.svg') +
					'"' +
					'alt="' + t('gallery', 'Picture view') + '"/>' +
					'</div>' +
					'<div id="gallery-button" class="button view-switcher right-switch-button inactive-button">' +
					'<img class="svg" src="' + OC.imagePath('core', 'actions/toggle-pictures.svg') +
					'"' +
					'alt="' + t('gallery', 'Picture view') + '"/>' +
					'</div>');

			GalleryButton.button.click(function () {
				$(this).addClass('loading');
				window.location.href = GalleryButton.url;
			});

			$('#controls').prepend(GalleryButton.button);
		}
	}
);
