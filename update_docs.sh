echo "Cloning Source repo"
git clone --single-branch --branch https://$GITHUB_TOKEN@github.com/ealush/vest.git vest

echo "Cloning docs branches"
git clone --single-branch --branch gh-pages https://$GITHUB_TOKEN@github.com/ealush/vest.git vest_docs
git clone --single-branch --branch gh-pages https://$GITHUB_TOKEN@github.com/ealush/n4s.git n4s_docs

echo "Retrieving Versions"
cd ./vest/packages/vest
export VEST_VERSION=$(node -pe "require('./package.json').version")
echo "VEST: $VEST_VERSION"

cd ../n4s
export N4S_VERSION=$(node -pe "require('./package.json').version")
echo "N4S: $N4S_VERSION"

cd $TRAVIS_BUILD_DIR

echo "Copying docs over"
cp -R ./vest/packages/vest/docs/. vest_docs/
cp -R ./vest/packages/n4s/docs/. n4s_docs/

cd vest_docs
git add .
git commit -m "$VEST_VERSION"
git push origin gh-pages

cd $TRAVIS_BUILD_DIR

cd n4s_docs
git add .
git commit -m "$N4S_VERSION"
git push origin gh-pages