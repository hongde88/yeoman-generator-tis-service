const gulp = require('gulp');
const nodemon = require('nodemon');
const mocha = require('gulp-mocha');
const exec = require('child_process').exec;
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('dev', dev);
gulp.task('test-unit', testUnit);
gulp.task('build', build);
gulp.task('cover', cover);


function cover(done) {
  exec('npm run cover', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    done()
  });
}

function build() {
  return gulp.src('src/**/*.ts', {
    base: 'dist',
  })
    .pipe(tsProject())
    .pipe(gulp.dest('dist'));
}

function dev(done) {
  nodemon({
    watch: ['src', '.env'],
    ext: 'ts',
    exec: 'ts-node -r dotenv/config src/index.ts'
  });

  done();
}

function testUnit(done) {
  gulp.src(['test/boot.ts', 'test/unit/**/*.spec.ts'], {read: false, base: '.'})
    .pipe(tsProject())
    .pipe(gulp.dest('.'))
    .pipe(mocha({reporter: 'nyan', exit: true, bail: true}))
    .on('error', () => process.exit(1));
  done();
}
