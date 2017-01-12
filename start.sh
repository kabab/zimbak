#! /bin/bash

APPNAME=app
APPPATH=app.js
PIDPATH=${APPNAME}.pid
LOGPATH=log/${APPNAME}.log

function stop {
	echo "Stopping the server"
	if [ -e $PIDPATH ]
	then
		kill -9 `cat $PIDPATH`
		rm $PIDPATH
	else
		echo "Pid file doesn't exist"

		echo "Check if there's a running APP"
		# I used regrex to ignore the egrep command 
		# try to remove the bracket to see the difference
		if ! ( ps -aux  | egrep "np[m]" )
		then
			echo "The app isn't currently running"
			return 1
		fi
	
		read  -p "Kill All [y/N] : " k
		if echo $k | grep -i "y" -q
		then
			ps -aux  | grep npm | cut -d " " -f 4 | xargs kill -9
		fi
	fi
}

function start {
	echo "Check if the app is already running"
	if ( ps -aux  | egrep "n[a-z]* $APPNAME" )
      	then
		read -p "The app is already started do you like to restart it : " k
                if echo $k | grep -i "y" -q
                then
                        restart
			return $?
                else
			exit 1
		fi
        fi

	echo "Starting $APPNAME"
	if ( kill -0 `cat $PIDPATH` ) &> /dev/null
	then
		echo "App already running with pid : " `cat $PIDPATH`
		exit 1
	fi
	npm start &> $LOGPATH  &
	echo $! > app.pid
}

function restart {
	echo "Restarting $APPNAME"
	stop
	start
}

function log {
	tailf -20 $LOGPATH
}

function status {
	if (kill -0 `cat $PIDPATH`) &> /dev/null
	then
		echo "The app is running with pid : " `cat $PIDPATH`
		return 0
	else
		echo "The app is not running"
		return 1
	fi
}

case $1 in
        start)
                start
                ;;
        stop)
                stop
                ;;
        restart)
                restart
                ;;
	log)
		log
		;;
	status)
		status
		;;

esac
