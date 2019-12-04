import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'
import ViewGrade from "./ViewGrade";

const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 24,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SimpleCard(props) {
  const classes = useStyles();
    let button1,button2,desc
if(props.action1 && props.action2) {
    button1=  <Link to={props.link1}> <Button  size="small" color="primary">{props.action1}</Button></Link>
    button2=<Link to={props.link2}><Button size="small" color="primary">  {props.action2} </Button></Link>
} else if(props.action1){
    button1=  <Link to={props.link1}> <Button size="small" color="primary">{props.action1}</Button></Link>
}

if(props.description==="grade")
{
desc=ViewGrade()
}
else
{
    desc= props.description
}

  return (
    <Card className={classes.title}>

      <CardContent>
        <Typography className={classes.title} color="primary" gutterBottom>
            {props.title}
        </Typography>
        <Typography variant="h5" component="h2">
            <h4> {props.content}</h4>
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
        {desc}
        </Typography>

      </CardContent>
      <CardActions >
          {button1}{button2}
      </CardActions>
    </Card>
  );
}