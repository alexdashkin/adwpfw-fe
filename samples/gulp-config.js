const name = 'samrom-extensions';
const src = './src/';
const dist = './dist/';

module.exports = {
	paths: {
		src,
		dist,
		replace: [
			src + name + '.php'
		],
		version: src + name + '.php',
		copy: {
			src: [
				src + 'README.md',
				src + 'inc/**/*',
				src + 'tpl/**/*',
				src + 'vendor/**/*',
				src + 'config/**/*',
			],
		},
		adwpfwTpl: {
			src: src + 'vendor/alexdashkin/adwpfw/tpl/**/*',
			dev: src + 'tpl/adwpfw',
		},
		styles: {
			admin: {
				src: src + 'assets/css/admin/app/*.scss',
				dev: src + 'assets/css/admin',
				prod: dist + 'assets/css/admin',
			},
			front: {
				src: src + 'assets/css/front/app/*.scss',
				dev: src + 'assets/css/front',
				prod: dist + 'assets/css/front',
			}
		},
		scripts: {
			admin: {
				src: src + 'assets/js/admin/app/*.js',
				dev: src + 'assets/js/admin',
				prod: dist + 'assets/js/admin',
			},
			front: {
				src: src + 'assets/js/front/app/*.js',
				dev: src + 'assets/js/front',
				prod: dist + 'assets/js/front',
			}
		},
		images: {
			src: src + 'assets/img/**/*',
			prod: dist + 'assets/img'
		},
		svg: {
			src: src + 'assets/svg/*.svg',
			prod: dist + 'assets/svg'
		},
		zip: dist + '**/*'
	},
	names: {
		file: name,
		svgSprite: 'sprite.svg',
		replace: {
			from: "ENV', 'dev');",
			to: "ENV', 'prod');"
		},
	}
};
