import {
  Checkbox,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack
} from "@mui/material";
import React, { useCallback } from "react";
import dragFileStore from "../stores/DragFileStore";
import { observer } from "mobx-react-lite";

const WorkHours = observer(() => {
  const { work_hours_list } = dragFileStore;
  const FULL_TIME_HOURS = 40 * 60;
  const [totalWorkHour, setTotalWorkHour] = React.useState(0);
  const [check_lunch, setCheck_lunch] = React.useState({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
  });
  const [check_dinner, setCheck_dinner] = React.useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const [work_hour_obj, setWork_hour_obj] = React.useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });

  const days = ["월", "화", "수", "목", "금"];


  const hourToMinute = (number) => {
    return number * 60;
  };

  const minuteToHour = (number) => {
    const hour = parseInt(number / 60)
      .toString()
      .padStart(2, "0");
    const minute = (number % 60).toString().padStart(2, "0");
    return [hour, minute];
  };

  const calWorkHours = useCallback((enter, out) => {
    const newEnter = enter.split(":");
    const newOut = out.split(":");
    const enterMinute = hourToMinute(Number(newEnter[0])) + Number(newEnter[1]);
    const outMinute = hourToMinute(Number(newOut[0])) + Number(newOut[1]);
    const workMinutes = outMinute - enterMinute - 60;
    return workMinutes;
  }, []);

  const handleLunch = (e, idx) => {
    check_lunch[idx] = e.target.checked;
    const newCheck_lunch = { ...check_lunch };
    if (newCheck_lunch[idx]) {
      work_hour_obj[idx] -= 60;
      const newWork_hour_obj = { ...work_hour_obj };
      setWork_hour_obj(newWork_hour_obj);
      setTotalWorkHour((pre) => pre - 60);
    } else {
      work_hour_obj[idx] += 60;
      const newWork_hour_obj = { ...work_hour_obj };
      setWork_hour_obj(newWork_hour_obj);
      setTotalWorkHour((pre) => pre + 60);
    }
    setCheck_lunch(newCheck_lunch);
  };

  const handleDinner = (e, idx) => {
    check_dinner[idx] = e.target.checked;
    const newCheck_dinner = { ...check_dinner };
    if (newCheck_dinner[idx]) {
      work_hour_obj[idx] -= 60;
      const newWork_hour_obj = { ...work_hour_obj };
      setWork_hour_obj(newWork_hour_obj);
      setTotalWorkHour((pre) => pre - 60);
    } else {
      work_hour_obj[idx] += 60;
      const newWork_hour_obj = { ...work_hour_obj };
      setWork_hour_obj(newWork_hour_obj);
      setTotalWorkHour((pre) => pre + 60);
    }
    setCheck_dinner(newCheck_dinner);
  };

  const hoursArr=Array.from({ length: 25 }, (_, index) => {
    const formattedHour = String(index).padStart(2, '0');
    return formattedHour;
  })
  const minuteArr = Array.from({ length: 60 }, (_, index) => {
    const formattedHour = String(index).padStart(2, '0');
    return formattedHour;
  })

  // const onChangeHour = (e, idx)=>{
  //   setWork_hour_obj
  // } 

  React.useEffect(() => {
    let totalMinutes = 0;
    work_hours_list.forEach((v, idx) => {
      const workMinutes = calWorkHours(v["입실"], v["퇴실"]);
      work_hour_obj[idx] = workMinutes;
      const newWorkHourObj = { ...work_hour_obj };

      setWork_hour_obj(newWorkHourObj);
      totalMinutes += workMinutes;
    });
    setTotalWorkHour(totalMinutes);
  }, [calWorkHours, work_hours_list]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {days.map((v) => (
              <TableCell align="center" key={v}>
                {v}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {work_hours_list.map((_, idx) => (
              <TableCell align="center" key={idx}>
                점심
                <Checkbox
                  label="점심"
                  checked={check_lunch[idx]}
                  onChange={(e) => handleLunch(e, idx)}
                />
              </TableCell>
            ))}
            {new Array(5 - work_hours_list.length)
              .fill(<Checkbox checked={false} disabled />)
              .map((v, idx) => (
                <TableCell align="center" key={idx}>점심 {v}</TableCell>
              ))}
          </TableRow>
          <TableRow>
            {work_hours_list.map((_, idx) => (
              <TableCell align="center" key={idx}>
                저녁{" "}
                <Checkbox
                  checked={check_dinner[idx]}
                  onChange={(e) => handleDinner(e, idx)}
                />
              </TableCell>
            ))}
            {new Array(5 - work_hours_list.length)
              .fill(<Checkbox checked={false} disabled />)
              .map((v,idx) => (
                <TableCell align="center" key={idx}>저녁 {v}</TableCell>
              ))}
          </TableRow>

          <TableRow>
            {work_hours_list.map((v,idx) => (
              <TableCell align="center" key={idx}>입실 : {v["입실"]}</TableCell>
            ))}
            {new Array(5 - work_hours_list.length)
              .fill("입실")
              .map((v,idx) => (
                <TableCell align="center" key={idx} >
                  <Stack direction={"row"} sx={{alignItems:'center'}}>
                  <Typography sx={{wordBreak:"keep-all"}}>{v} </Typography>
                  <Select defaultValue={"00"}>
                    {hoursArr.map((item)=><MenuItem value={item}>{item}</MenuItem>)}
                  </Select>
                  <Typography>:</Typography>
                  <Select defaultValue={"00"}>
                  {minuteArr.map((item)=><MenuItem value={item}>{item}</MenuItem>)}
                  </Select>
                  </Stack>
                </TableCell>
              ))}
          </TableRow>
          <TableRow>
            {work_hours_list.map((v,idx) => (
              <TableCell align="center" key={idx}>퇴실 : {v["퇴실"]}</TableCell>
            ))}
            {new Array(5 - work_hours_list.length)
              .fill("퇴실 : 00:00")
              .map((v,idx) => (
                <TableCell align="center" key={idx}>{v}</TableCell>
              ))}
          </TableRow>
          <TableRow>
            {work_hours_list.map((v, idx) => (
              <TableCell align="center">
                근무 시간 :{" "}
                {`${minuteToHour(work_hour_obj[idx]).join("시간 ")}분`}
              </TableCell>
            ))}
            {new Array(5 - work_hours_list.length)
              .fill("근무 시간 : 00:00")
              .map((v,idx) => (
                <TableCell align="center" key={idx}>{v}</TableCell>
              ))}
          </TableRow>
          <TableRow>
            <TableCell align="center" colSpan={5}>
              총 근무시간 :
              {totalWorkHour &&
                `${minuteToHour(totalWorkHour).join("시간 ")}분`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center" colSpan={5}>
              남은 근무시간 :
              {totalWorkHour &&
                `${minuteToHour(FULL_TIME_HOURS - totalWorkHour).join(
                  "시간 "
                )}분`}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default WorkHours;
