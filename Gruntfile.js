module.exports = function (grunt) {

    grunt.config.init({
        pkg: grunt.file.readJSON('package.json'),

        ftp: {
            host    : 'w2ui.com',
            folder  : '/var/www/biport',
            user    : 'root',
        },

        prompt: {
            pass: {
                options: {
                    questions: [{
                        config   : 'ftp.pass',
                        type     : 'password',    // can be list, checkbox, confirm, input, password
                        message  : 'Password for w2ui.com: '
                    }]
                }
            }
        },

        less: {
            app: {
                options: {
                    cleancss : true,
                    report   : 'min'
                },
                files: [{
                    expand  : true,
                    cwd     : 'web/app/billing',
                    dest    : 'web/app/billing',
                    src     : '*.less',
                    ext     : '.css'
                }, {
                    expand  : true,
                    cwd     : 'web/app/helpdesk',
                    dest    : 'web/app/helpdesk',
                    src     : '*.less',
                    ext     : '.css'
                }, {
                    expand  : true,
                    cwd     : 'web/app/home/group',
                    dest    : 'web/app/home/group',
                    src     : '*.less',
                    ext     : '.css'
                }, {
                    expand  : true,
                    cwd     : 'web/app/home/user',
                    dest    : 'web/app/home/user',
                    src     : '*.less',
                    ext     : '.css'
                }, {
                    expand  : true,
                    cwd     : 'web/app/home/time-sheets',
                    dest    : 'web/app/home/time-sheets',
                    src     : '*.less',
                    ext     : '.css'
                }, {
                    expand  : true,
                    cwd     : 'web/app/main',
                    dest    : 'web/app/main',
                    src     : '*.less',
                    ext     : '.css'
                }, {
                    expand  : true,
                    cwd     : 'web/app/project',
                    dest    : 'web/app/project',
                    src     : '*.less',
                    ext     : '.css'
                }]
            },
            icons: {
                options: {
                    cleancss: true,
                    report  : 'min'
                },
                files: {
                    "web/app/icons/icon-font.css": "web/app/icons/icon-font.css"
                }
            }
        },        

        shell: {
            clean: {
                command: 'rm -rf build'
            },
            build: {
                command: [
                    'mkdir build', 
                    'tar -czvf build/<%=pkg.name%>.tar.gz api web conf.js package.json server.js'
                ].join('&&')
            },
            "build-server": {
                command: [
                    'mkdir build', 
                    'tar -czvf build/<%=pkg.name%>.tar.gz api server.js'
                ].join('&&')
            }
        },

        sftp: {
            upload: {
                files: {
                    "./": "build/<%=pkg.name%>.tar.gz"
                },
                options: {
                    srcBasePath       : 'build/',
                    createDirectories : true,
                    showProgress      : true,
                    path     : '<%=ftp.folder%>',
                    host     : '<%=ftp.host%>',
                    username : '<%=ftp.user%>',
                    password : '<%=ftp.pass%>'
                }
            }
        },

        sshexec: {
            deploy: {
                command: [
                    'cd <%=ftp.folder%>',
                    'rm -rf api web package.json server.js',
                    'tar -xzf <%=pkg.name%>.tar.gz',
                    'rm <%=pkg.name%>.tar.gz',
                    'echo "Deployed to <%=ftp.folder%>"'
                ].join('&&'),
                options: {
                    host     : '<%=ftp.host%>',
                    username : '<%=ftp.user%>',
                    password : '<%=ftp.pass%>',
                }
            },
            "deploy-server": {
                command: [
                    'cd <%=ftp.folder%>',
                    'rm -rf api server.js',
                    'tar -xzf <%=pkg.name%>.tar.gz',
                    'rm <%=pkg.name%>.tar.gz',
                    'echo "Deployed to <%=ftp.folder%>"'
                ].join('&&'),
                options: {
                    host     : '<%=ftp.host%>',
                    username : '<%=ftp.user%>',
                    password : '<%=ftp.pass%>',
                }
            }
        },

        webfont: {
            icons: {
                src : 'web/app/icons/svg/*.svg',
                dest: 'web/app/icons/',
                options: {
                    engine  : 'node',
                    font    : 'icon-font',
                    syntax  : 'bootstrap',
                    types   : 'woff',
                    embed   : true
                }           
            }
        },

        watch: {
            app: {
                files	: ['web/app/**/*.less'],
                tasks	: ['less:app'],
                options	: {
                    nospawn: true
                }
            },
            webfont: {
                files: ['web/app/icons/svg/*.svg'],
                tasks: ['webfont', 'less:icons']
            }
        }
    
    });

    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-prompt');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-ssh');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['shell:clean', 'webfont', 'less', 'shell:build']);
    grunt.registerTask('clean', ['shell:clean']);
    grunt.registerTask('deploy', ['shell:clean', 'webfont', 'less', 'shell:build', 'prompt:pass', 'sftp:upload', 'sshexec:deploy']);
    grunt.registerTask('deploy-server', ['shell:clean', 'shell:build-server', 'prompt:pass', 'sftp:upload', 'sshexec:deploy-server']);
};