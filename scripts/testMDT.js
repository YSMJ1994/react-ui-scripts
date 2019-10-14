const getMDT = require('./MDT')

const md = getMDT();
const str = `# 测试

这是一份测试文档。
这是一份测试文档。2

## test comp

<Button>test comp</Button>`


console.log('render:', md.render(str))
