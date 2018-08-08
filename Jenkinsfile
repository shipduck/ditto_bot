pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh '''npm ci
npm run build'''
      }
    }
    stage('Run') {
      steps {
        sh 'pm2 --name=ditto start dist/main.js'
      }
    }
  }
  environment {
    token = 'xoxb-2161018487-411742259925-MwR2rh04n84vTpRwx9HpqIrA'
  }
}