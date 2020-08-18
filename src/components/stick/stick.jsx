import React, { useEffect } from 'react';
import { Group, Circle, Line } from 'react-konva';
import { getPointsAfterMove, getPointAfterRotate, getPointsAfterRotate } from '../../model'
import usePoints from '../../hooks/usePoints';

const Stick = ({centerPt,length,strokeWidth,radius}) => {
    const {active,points,editPoints,addFrames,playFrames,setActive} = usePoints(
            {point1: [centerPt[0], centerPt[1] - length],
            point2: [centerPt[0], centerPt[1]],
            point3: [centerPt[0], centerPt[1] + length]})
    const {point1,point2,point3} = points
    const stageElement = document.getElementById('stage')
    const init = (e) => {
        const activePoint = e.target.attrs.id
        setActive(activePoint)
    }
    useEffect(() => {
        document.getElementById('save').addEventListener('click', addFrames)
        document.getElementById('play').addEventListener('click', playFrames)
        return () => {
            document.getElementById('save').removeEventListener('click', addFrames)
            document.getElementById('play').removeEventListener('click', playFrames)
        }
    })
    useEffect(() => {
        const handleMouseMove = async (e) => {
        switch (active) {
            case "point1":
                await editPoints(getPointsAfterMove(e, points, active))
                break;
            case "point2":
                await editPoints(getPointsAfterRotate(e, points, 'point2', 'point1'))
                break;
            case "point3":
                await editPoints(getPointAfterRotate(e, points, 'point3','point2'))
                break;
            default:
                break;
            }
        }
        const handleMouseUp = () => {
            setActive("")
            stageElement.removeEventListener('mousemove', handleMouseMove)
            stageElement.removeEventListener('mouseup', handleMouseUp)
        }
        if (active !== "") {
            stageElement.addEventListener('mouseup', handleMouseUp)
            stageElement.addEventListener('mousemove', handleMouseMove)
        }
    }, [active])
    return (
        <Group>
            <Line
                id="part1"
                points={point1.concat(point2)}
                stroke="black"
                strokeWidth={strokeWidth}
                lineCap="round"
            />
            <Line
                id="part2"
                points={point2.concat(point3)}
                stroke="black"
                strokeWidth={strokeWidth}
                lineCap="round"
            />
            <Circle
                id="point1"
                radius={radius}
                fill="blue"
                x={point1[0]}
                y={point1[1]}
                onMouseDown={init}
            />
            <Circle
                id="point2"
                radius={radius}
                fill="orange"
                x={point2[0]}
                y={point2[1]}
                onMouseDown={init}
            />
            <Circle
                id="point3"
                radius={radius}
                fill="pink"
                x={point3[0]}
                y={point3[1]}
                onMouseDown={init}
            />
        </Group>
    )
}

export default Stick;