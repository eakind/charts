export default {
  data () {
    return {
      list: [
        {
          label: '固定宽度',
          value: 'fixedWidth',
        }
        // {
        //   label: '常用尺寸',
        //   value: 'common',
        // },
        // {
        //   label: '自定义',
        //   value: 'define',
        // },
      ],
      commonSize: [
        {
          label: '1366*768',
          value: 0,
          size: {
            width: 1366,
            height: 768,
          },
        },
        {
          label: '1024*768',
          value: 1,
          size: {
            width: 1024,
            height: 768,
          },
        },
        {
          label: '1920*1080',
          value: 2,
          size: {
            width: 1920,
            height: 1080,
          },
        },
        {
          label: 'A4横向 1169*827',
          value: 3,
          size: {
            width: 1169,
            height: 827,
          },
        },
        {
          label: 'A4纵向 827*1169',
          value: 4,
          size: {
            width: 827,
            height: 1169,
          },
        },
        {
          label: 'PPT 1600*900',
          value: 5,
          size: {
            width: 1600,
            height: 900,
          },
        },
      ],
    };
  }
};
