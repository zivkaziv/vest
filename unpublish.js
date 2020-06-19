const jsnpm = require("jsnpm");

const TAG_DEV = "dev";
const TAG_NEXT = "next";
const VERSION_REGEXP = new RegExp([TAG_NEXT, TAG_DEV].join("|"));

const unpublish = async (packageName) => {
  const versions = await jsnpm.versions(packageName);
  const taggedNext = await jsnpm.getVersion(packageName, TAG_NEXT);
  const taggedDev = await jsnpm.getVersion(packageName, TAG_DEV);

  const nextOnly = versions.filter((v) => {
    if ([taggedNext, taggedDev].includes(v)) {
      return false;
    }

    return !!v.match(VERSION_REGEXP);
  });

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
  };

  one();
};

const runUnpublish = async () => {
  await unpublish("vest");
  await unpublish("eslint-plugin-vest");
  await unpublish("n4s");
};

runUnpublish();
