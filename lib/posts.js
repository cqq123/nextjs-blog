import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

const postsDirection = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirection);
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '');

    const fullPath = path.join(postsDirection, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterRedult = matter(fileContents);
    return {
      id,
      ...matterRedult.data,
    }
  })
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirection);
  return fileNames.map(fileName => `/posts/${fileName.replace(/\.md$/, '')}`)
  // return fileNames.map(fileName => ({
  //   params: {
  //     id: fileName.replace(/\.md$/, '')
  //   }
  // }))
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirection, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data,
  }
}