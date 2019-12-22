const jsnpm = require('jsnpm');

const PACKAGE_NAME = 'vest';

const unpublish = async () => {
    const versions = await jsnpm.versions(PACKAGE_NAME);
    const nextOnly = versions.filter((v) => v.includes('next'));

    const one = async (i = 0) => {
        if (!nextOnly[i]) {
            return;
        }

        console.log(`Unpublishing: ${PACKAGE_NAME}@${nextOnly[i]}`);
        await jsnpm.unpublish(PACKAGE_NAME, nextOnly[i]);

        one(++i);
    }

    one();
}

unpublish();

