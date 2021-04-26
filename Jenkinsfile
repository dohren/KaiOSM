@Library('pipeline@master') _

pipeline {
    agent any

    stages {
        stage('Prepare') {
            steps {
                script {
                    pipe.prepare()
                }
            }
        }

        stage('Build') {
            steps {
                sh 'printenv'
                script {
                    pipe.build()
                }
            }
        }
        stage('Build Container') {
            steps {
                script {
                    pipe.container()
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    pipe.helm()
                }
            }
        }
    }
}