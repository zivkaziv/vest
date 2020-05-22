const jsnpm = require('jsnpm');

const unpublish = async (packageName) => {
    const versions = await jsnpm.versions(packageName);
    const nextOnly = versions.filter((v) => v.includes('next'));

    const one = async (i = 0) => {
        const current = nextOnly[i];

        if (!current) {
            return;
        }

        console.log(`Unpublishing: ${packageName}@${current}`);

        try {
            await jsnpm.unpublish(packageName, current);
        } catch (e) {
            console.log(`Unable to unpublish: ${current}`, e);
        }

        one(++i);
    }

    one();
}

const runUnpublish = async () => {
    await unpublish('vest');
    await unpublish('eslint-plugin-vest');
}

runUnpublish();

