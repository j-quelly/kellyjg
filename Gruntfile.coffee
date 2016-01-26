module.exports = (grunt) ->
	grunt.initConfig
		pkg: grunt.file.readJSON("package.json") 
		path: require "path"


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
					# "dist/jquery.js"
					# "dist/js/bootstrap.js"
				]
				ignorePath: /^(\.\.\/\.\.\/)/


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
			dev:
				options:
					compress: false
				files: [
					"public<%= path.sep %>css<%= path.sep %>app.css" : "less<%= path.sep %>bootstrap.less",
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
				tasks: ['less:dev'] 
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


		# concat bower components
		bower_concat: 
			build: 
		    	dest: 'public/js/lib.js' 
		    	dependencies: 
		    		'materialize' : 'jquery'
		    		'angular-materialize' : 'materialize'
		    	include: [
		    		'jquery',
		    		'materialize',
		    		'angular',
		    		'angular-route',
		    		'angular-materialize',
		    		'angular-animate'
		    	]



		# minify js
		uglify:
			build:
				options:
					beautify: false
				files:	
					"public<%= path.sep %>js<%= path.sep %>lib.min.js" : 'public<%= path.sep %>js<%= path.sep %>lib.js'				


		# compress our css files		
		cssmin:
			build:
				files:
					"public<%= path.sep %>css<%= path.sep %>app.min.css": [
						'public' + '<%= path.sep %>css<%= path.sep %>*.css'
						'!public' + '<%= path.sep %>css<%= path.sep %>app.min.css'
					]	


		# replace dev dep with build dependencies
		'string-replace': 
			dev:
				files:
					'views<%= path.sep %>layout.jade' : 'views<%= path.sep %>layout.jade'
				options:
					replacements: [
						{
							pattern: 'link(rel="stylesheet", href="css/app.min.css")' 
							replacement: 'link(rel="stylesheet", href="css/app.css")' 
						},
						{
							pattern: "script(src='js/lib.min.js')"
							replacement: ""
						}																		
					]		
			build:
				files:
					'views<%= path.sep %>layout.jade' : 'views<%= path.sep %>layout.jade'
				options:
					replacements: [
						{
							pattern: 'link(rel="stylesheet", href="css/app.css")' 
							replacement: 'link(rel="stylesheet", href="css/app.min.css")' 
						},
						{
							pattern: "script(src='../bower_components/jquery/dist/jquery.js')"
							replacement: ""
						},
						{
							pattern: "script(src='../bower_components/Materialize/bin/materialize.js')"
							replacement: ""
						},
						{
							pattern: "script(src='../bower_components/angular/angular.js')"
							replacement: ""
						},
						{
							pattern: "script(src='../bower_components/angular-route/angular-route.js')"
							replacement: ""
						},
						{
							pattern: "script(src='../bower_components/angular-materialize/src/angular-materialize.js')"
							replacement: ""
						},
						{
							pattern: "script(src='../bower_components/angular-animate/angular-animate.js')"
							replacement: "script(src='js/lib.min.js')"
						}
					]								



	# require our tasks
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt); 
	grunt.loadNpmTasks "grunt-string-replace"


	# register our grunt tasks
	grunt.registerTask("default", ["availabletasks"])
	grunt.registerTask("serve-dev", ["wiredep", "less:dev", "concurrent:dev"])
	grunt.registerTask("build", ["bower_concat:build", "uglify:build", "cssmin:build", "string-replace:build", "nodemon"])