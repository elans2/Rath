import React, { useMemo } from 'react';
import { DataSource } from '../global';
import ReactVega from './react-vega';

interface SimpleTickProps {
  x: string;
  y: string;
  threshold: number;
  dataSource: DataSource
}
const SimpleTick: React.FC<SimpleTickProps> = props => {
  const { x, y, threshold, dataSource = [] } = props;
  const spec = useMemo<any>(() => {
    return {
      width: 180,
      height: 200,
      data: {
        name: 'dataSource'
      },
      transform: [
        { calculate: threshold.toString(), as: 'threshold' }
      ],
      layer: [
        {
          mark: 'point',
          encoding: {
            x: {
              field: x,
              type: 'nominal',
              scale: {
                domain: ['outlier', 'trend', 'general']
              }
            },
            y: {
              field: y,
              type: 'quantitative',
              scale: {
                domain: [0, 1]
              }
            }
          }
        },
        {
          mark: 'rule',
          encoding: {
            y: {
              field: 'threshold',
              type: 'quantitative'
            },
            color: {
              value: 'red'
            }
          }
        }
      ]
    }
  }, [x, y, threshold])
  return <div>
    <ReactVega spec={spec} dataSource={dataSource} />
  </div>;
}

export default SimpleTick;