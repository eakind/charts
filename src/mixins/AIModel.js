import { downloadImage } from '@/utils/domSaver';
export const AIModel = {
  data () {
    return {
      model: {
        modelName: 'Random Forset',
        config_roc: {
          size: {
            width: 600,
            height: 600
          },
          bindto: '#view-roc',
          font: {
            size: 16
          },
          rotate: false,
          type: 'numeric', // bin, numeric
          divide: {
            show: true,
            color: '#4E4E4E',
            width: 3
          },
          x: {
            name: 'fpr',
            grid: {
              show: true,
              color: '#4E4E4E',
              width: 1
            },
            axis: {
              line: {
                show: true,
                color: '#F6B421',
                width: 2
              },
              ticks: {
                show: true,
                color: '#666666'
              },
              title: {
                show: true,
                color: '#666666'
              }
            }
          },
          y: {
            grid: {
              show: true,
              color: '#4E4E4E',
              width: 2
            },
            axis: {
              line: {
                show: true,
                color: '#F6B421',
                width: 2
              },
              ticks: {
                show: true,
                color: '#666666'
              },
              title: {
                show: true,
                color: '#666666'
              }
            }
          },
          tooltip: {
            background: 'white',
            color: 'black'
          },
          padding: {
            left: 50,
            right: 10,
            top: 10,
            bottom: 50
          },
          data: [
            // {fpr: 0, tpr: 0},
            // {fpr: 0.05, tpr: 0.1},
            // {fpr: 0.1, tpr: 0.25},
            // {fpr: 0.3, tpr: 0.5},
            // {fpr: 0.4, tpr: 0.53},
            // {fpr: 0.5, tpr: 0.88},
            // {fpr: 0.6, tpr: 0.89},
            // {fpr: 0.7, tpr: 0.96},
            // {fpr: 0.8, tpr: 0.97},
            // {fpr: 0.9, tpr: 0.98},
            // {fpr: 1, tpr: 1},
          ],
          combined: [
            {
              type: 'line', // line,
              name: 'tpr',
              axis: 'y',
              style: {
                stroke: {
                  color: '#2193F6',
                  width: 4
                },
                point: {
                  type: 'circle',
                  size: 50,
                  color: '#2193F6'
                },
                interpolate: true
              }
            }
          ]
        },
        config_importance: {
          size: {
            width: 1200,
            height: 650
          },
          bindto: '#view-importance',
          font: {
            size: 13
          },
          rotate: true,
          type: 'category', // bin, numeric
          x: {
            name: 'factor',
            grid: {
              show: false,
              color: '#4E4E4E',
              width: 2
            },
            axis: {
              line: {
                show: true,
                color: '#F6B421',
                width: 2
              },
              ticks: {
                show: true,
                color: '#666666'
              },
              title: {
                show: true,
                color: '#666666'
              }
            }
          },
          y: {
            grid: {
              show: true,
              color: '#4E4E4E',
              width: 2
            },
            axis: {
              line: {
                show: true,
                color: '#F6B421',
                width: 2
              },
              ticks: {
                show: true,
                color: '#666666'
              },
              title: {
                show: true,
                color: '#666666'
              }
            }
          },
          tooltip: {
            background: 'white',
            color: 'black'
          },
          padding: {
            left: 100,
            right: 15,
            top: 50,
            bottom: 10
          },
          data: [
            // {feature: 'feature 1', percent: 90},
            // {feature: 'feature 11', percent: 80},
            // {feature: 'feature 12', percent: 80},
            // {feature: 'feature 13', percent: 70},
            // {feature: 'feature 14', percent: 65},
            // {feature: 'feature 15', percent: 60},
            // {feature: 'feature 16', percent: 40},
            // {feature: 'feature 17', percent: 20},
            // {feature: 'feature 18', percent: 10}
          ],
          combined: [
            {
              type: 'bar', // line,
              name: 'percent',
              axis: 'y',
              style: {
                fill: '#2193F6',
                radius: 5,
                band: 50,
                padding: 2.5
              }
            }
          ]
        },
        config_accuracy: {
          size: {
            width: 1250,
            height: 650
          },
          bindto: '#view-accuracy',
          font: {
            size: 13
          },
          rotate: false,
          type: 'numeric', // bin, numeric
          x: {
            name: 'group',
            grid: {
              show: true,
              color: '#4E4E4E',
              width: 2
            },
            axis: {
              line: {
                show: true,
                color: '#F6B421',
                width: 2
              },
              ticks: {
                show: true,
                color: '#666666'
              },
              title: {
                show: true,
                color: '#666666'
              }
            }
          },
          y: {
            grid: {
              show: true,
              color: '#4E4E4E',
              width: 2
            },
            axis: {
              line: {
                show: true,
                color: '#F6B421',
                width: 2
              },
              ticks: {
                show: true,
                color: '#666666'
              },
              title: {
                show: true,
                color: '#666666'
              }
            }
          },
          tooltip: {
            background: 'white',
            color: 'black'
          },
          padding: {
            left: 50,
            right: 15,
            top: 10,
            bottom: 50
          },
          data: [
            // {group: 1, actual: 20, predict: 40},
            // {group: 2, actual: 30, predict: 45},
            // {group: 3, actual: 50, predict: 50},
            // {group: 4, actual: 70, predict: 60},
            // {group: 5, actual: 70, predict: 65},
            // {group: 6, actual: 80, predict: 70},
            // {group: 7, actual: 85, predict: 75},
            // {group: 8, actual: 89, predict: 80},
            // {group: 9, actual: 90, predict: 95},
          ],
          combined: [
            {
              type: 'line', // line,
              name: 'actual',
              axis: 'y',
              style: {
                stroke: {
                  color: '#4E4E4E',
                  width: 5
                },
                point: {
                  type: 'circle',
                  size: 120,
                  color: '#4E4E4E'
                },
                interpolate: false
              }
            },
            {
              type: 'line', // line,
              name: 'predict',
              axis: 'y',
              style: {
                stroke: {
                  color: '#F6B421',
                  width: 5
                },
                point: {
                  type: 'cross',
                  size: 120,
                  color: '#F6B421'
                },
                interpolate: false
              }
            }
          ]
        },
        // status: "success", //loading, success, failed
        rocStat: {
          name: 'AUC', // GINI
          value: 0
        }
      }
    };
  },
  methods: {
    exportModelData () {
      // this.currentData.bindto,
      // this.currentData.size,
      // this.current,
      // id == 0 ? 'transparent' : '#fff';
    },
    async saveModelChart (node, size, name, backgroundColor) {
      await downloadImage({
        node: node,
        name: name + new Date().getTime() + (backgroundColor === 'transparent' ? '.png' : '.jpeg'), // optional
        size: size, // optional
        backgroundColor: backgroundColor, // optional, jpg对应的是#fff,png对应的是transparent
        errorMsg: this.$i18n.t('message.save_image_error')
      });
    }
  }
};
