module.exports = (grunt) ->
	grunt.initConfig
		pkg: grunt.file.readJSON("package.json") 
		path: require "path"
		cb: "v1711"


		# list our available tasks
		availabletasks:
			tasks:
				options:
					filter: "include", 
					tasks: [ 
						"serve-dev"
					]
					descriptions:
						"serve-dev": "Boots up server and opens your default browser"


		# runs tasks concurrently				
		concurrent:
			dev: [
				"nodemon:dev",
				"watch"
			]
			options:
				logConcurrentOutput: true


		# boots up nodemon
		nodemon:
			dev:
				scripts: "bin<%= path.sep %>www"
				options:
					env: { 
						"NODE_ENV": "dev" 
					}				
					delay: 300
					callback: (nodemon) ->

						nodemon.on "log", (event) ->
							console.log event.colour
                        
						nodemon.on "config:update", ->
							setTimeout ->
								require("open") "http://localhost:3000"
							, 1000

						nodemon.on "restart", -> 
							setTimeout ->
								require("fs").writeFileSync(".rebooted", "rebooted")
							, 1000


		# wire bower dependencies
		wiredep:
			tasks:  
				directory: "bower_components"
				src: [
					"views<%= path.sep %>layout.jade"
				]
				cwd: './'
				exclude: [
					"dist/jquery.js"
					"dist/js/bootstrap.js"
				]
				ignorePath: /^(\.\.\/\.\.\/)/


		# cleans folders for us
		clean:
			images:
				src: ['public<%= path.sep %>images']
			css:
				src: ['public<%= path.sep %>css']
			js:
				src: ['public<%= path.sep %>js']
			tmp:
				src: ['.tmp']
			build:
				src: [
					'build<%= path.sep %>css'
					'build<%= path.sep %>js'
				]
			all:
				src: [
					'public<%= path.sep %>css'
					'public<%= path.sep %>images'
					'public<%= path.sep %>js'
				]


		# compile sass to css
		sass:
			dev:
				options:  
					compress: false 
				files: [
					"public<%= path.sep %>css<%= path.sep %>app.css" : "sass<%= path.sep %>materialize.scss",
				]


		# compile less to css
		less:
			vet:
				options:
					compress: false
				files: [{
					expand: true
					cwd: 'less<%= path.sep %>'
					src: ['*.less']
					ext: '.css'
					extDot: 'first'
					dest: '.tmp<%= path.sep %>css<%= path.sep %>'  
				}]			
			dev:
				options:
					compress: false
				files: [
					"public<%= path.sep %>css<%= path.sep %>app.css" : "less<%= path.sep %>bootstrap.less",
				]
			prebuild:
				options:
					compress: false
				files: [
					"build<%= path.sep %>css<%= path.sep %>app.css" : "less<%= path.sep %>bootstrap.less",
				]				


		# watches files and runs tasks when the files change
		watch:
			options:
				livereload: true

			sassfiles:
				files: [
					"sass<%= path.sep %>**<%= path.sep %>*.scss"
				]
				tasks: ['sass:dev']
				options:
					spawn: false

			lessfiles:
				files: [
					"less<%= path.sep %>**<%= path.sep %>*.less"
				]
				tasks: ['less:dev', "postcss:dist"] 
				options:
					spawn: false					

			jadefiles:
				files: [
					"views<%= path.sep %>**<%= path.sep %>*.jade"
				]
				options:
					spawn: false

			jsfiles:
				files: [
					"public<%= path.sep %>js<%= path.sep %>**<%= path.sep %>*.js"
				]					
				options: 
					spawn: false


		# compresses images for distribution
		imagemin: 
			build:
				options:
					cache: true
					optimizationLevel: 3
				files: [{
					expand: true
					cwd: 'public<%= path.sep %>images<%= path.sep %>'
					src: ['**<%= path.sep %>*.{png,jpg,gif,ico,pxm}'] 
					dest: 'public<%= path.sep %>images<%= path.sep %>'
				}]  


		# copies image files
		copy:
			# options: {
			# 	processContentExclude: ['**<%= path.sep %>*.{png,gif,jpg,ico}']
			# }
			images:
				files: [{
					expand: true
					cwd: 'public<%= path.sep %>images<%= path.sep %>'
					src: ['**<%= path.sep %>*.{svg,png,jpg}'] 
					dest: 'build<%= path.sep %>images<%= path.sep %>'   
				}]
			fonts:
				files: [{
					expand: true
					cwd: 'public<%= path.sep %>fonts<%= path.sep %>'
					src: ['**<%= path.sep %>*.*']
					dest: 'build<%= path.sep %>fonts<%= path.sep %>'
				}] 	 			

				


		# compile jade to html
		jade:
			compile:
				options:
					data:
						debug: false
					pretty: true
				files:
					"build<%= path.sep %>index.html" : ["views<%= path.sep %>index.jade"]


		# concat bower components
		bower_concat: 
			build: 
		    	dest: 'build<%= path.sep %>js<%= path.sep %>lib.js'
		    	# dependencies: 
		    	# 	'materialize' : 'jquery'
		    	# 	'angular-materialize' : 'materialize'
		    	include: [
		    		'wow'		    		
		    	]


		# remove unused css
		uncss:
			build:
				files: { 
					'build<%= path.sep %>css<%= path.sep %>app.optimized.css' : ['build<%= path.sep %>index.html']
				}


		# minify js
		uglify:
			build:
				options:
					beautify: false
				files: {	
					"build<%= path.sep %>js<%= path.sep %>app<%= cb %>.min.js" : ['public<%= path.sep %>js<%= path.sep %>app.js'],
					"build<%= path.sep %>js<%= path.sep %>lib<%= cb %>.min.js" : ['build<%= path.sep %>js<%= path.sep %>lib.js'],
				}


		# compress our css files		
		cssmin:
			build:
				files:
					"build<%= path.sep %>css<%= path.sep %>app<%= cb %>.min.css": [
						'build' + '<%= path.sep %>css<%= path.sep %>app.optimized.css'
						'!build' + '<%= path.sep %>css<%= path.sep %>app<%= cb %>.min.css'
						'!build' + '<%= path.sep %>css<%= path.sep %>app.css'
					]	


		# replace dev dep with build dependencies
		'string-replace':
			dev:
				files:
					'views<%= path.sep %>layout.jade' : 'views<%= path.sep %>layout.jade'
				options:
					replacements: [
						{
							pattern: 'link(rel="stylesheet", href="css/app.css")'  
							replacement: 'link(rel="stylesheet", href="css/app.css")'
						},
						{
							pattern: '// livereload'
							replacement: "script(src='//localhost:35729/livereload.js')" 
						},
						{
							pattern: "script(src='js/lib.js')"  
							replacement: "" #wiredep handles this
						},
						{
							pattern: "script(src='js/app.js')" 							
							replacement: "script(src='js/app.js')" 
						}
					]		
			build:
				files:
					'views<%= path.sep %>layout.jade' : 'views<%= path.sep %>layout.jade'
				options:
					replacements: [
						{
							pattern: 'link(rel="stylesheet", href="css/app.css")' 
							replacement: 'link(rel="stylesheet", href="css/app.css")' 
						},
						{
							pattern: "script(src='//localhost:35729/livereload.js')" 
							replacement: '// livereload' 
						},
						{
							pattern: "script(src='../bower_components/wow/dist/wow.js')" 
							replacement: "script(src='js/lib.js')" 
						},
						{
							pattern: "script(src='js/app.js')" 
							replacement: "script(src='js/app.js')" 
						},
						{
							pattern: "link(rel='stylesheet', href='../bower_components/animate.css/animate.css')" 
							replacement: "" 
						}						
					]	
			postbuild:
				files:
					'build<%= path.sep %>index.html' : 'build<%= path.sep %>index.html'
				options:
					replacements: [
						{
							pattern: 'app.css' 
							replacement: 'app<%= cb %>.min.css' 
						},
						{
							pattern: "app.js" 
							replacement: "app<%= cb %>.min.js" 
						},
						{
							pattern: "lib.js" 
							replacement: "lib<%= cb %>.min.js" 
						}					
					]


		# automagically prefix our css
		postcss:
			options:
				map: false,
				processors: [
					require('pixrem')(), # add fallbacks for rem units
        			require('autoprefixer')({browsers: ['last 2 versions']}), # add vendor prefixes
        		]
			dist:
				src: ['public<%= path.sep %>css<%= path.sep %>*.css', '!public<%= path.sep %>css<%= path.sep %>app<%= cb %>.min.css'] 
			vet:
				src: ['.tmp<%= path.sep %>css<%= path.sep %>**<%= path.sep %>*.css'] 


		# lint our css files 
		csslint:
			tmp:
				options:
					import: 2
					csslintrc: '.csslintrc'
				src: [
					'.tmp<%= path.sep %>css<%= path.sep %>**<%= path.sep %>*.css'
					'!.tmp<%= path.sep %>css<%= path.sep %>bootstrap.css'
				]				


	# require our tasks
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt); 
	grunt.loadNpmTasks "grunt-string-replace"


	# register our grunt tasks
	grunt.registerTask("default", ["availabletasks"])
	grunt.registerTask("serve-dev", ["string-replace:dev", "wiredep", "less:dev", "postcss:dist", "concurrent:dev"])
	grunt.registerTask("build", ["clean:build", "bower_concat:build", "imagemin:build", "copy:images",  "copy:fonts", "less:prebuild", "string-replace:build", "jade:compile", "uncss:build", "cssmin:build", "uglify:build", "string-replace:postbuild"])
	grunt.registerTask("vetcss", ["clean:tmp", "less:vet", "postcss:vet", "csslint:tmp"])

	# legend
	# bower_concat:build - combile bower dependencies to lib.js (not minified)
		# imagemin:build - compress images in public folder
	# copy:images - compies compressed images to build/images
	# copy:fonts - copies fonts
	# less:prebuild - compiles less to build/css/app.css (not minified)
	# string-replace:build - prepares jade file for compilation (will not work until files have been minified)
	# jade:compile - compiles jade index.html file 
	# uncss:build - remove unused css
	# cssmin:build - minify styles
	# uglify:build - minify js
	# string-replace:postbuild - add in .min postfixes