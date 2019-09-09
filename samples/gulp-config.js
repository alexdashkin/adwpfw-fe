const name = 'adwpfw';
const src = './src/';
const dist = './dist/';

module.exports = {
	paths: {
		src,
		dist,
		config: src + 'config/main.php',
		replace: [
			src + name + '.php'
		],
		version: [
			src + name + '.php',
			src + 'config/main.php',
		],
		copy: {
			src: [
				src + 'assets/css/admin/icons/*',
				src + 'assets/css/front/app.css',
				src + 'assets/css/fonts/**/*',
				src + 'assets/img/**/*',
				src + 'inc/**/*',
				src + 'tpl/**/*',
				src + 'vendor/**/*',
				src + 'config/**/*',
			],
		},
		php: {
			src: src + 'inc/**/*.php',
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
