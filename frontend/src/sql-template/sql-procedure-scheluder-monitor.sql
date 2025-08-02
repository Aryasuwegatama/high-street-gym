

-- Drop existing procedure if exists
DROP PROCEDURE IF EXISTS `high-street-gym`.`UpdateTimetable`;

DELIMITER //

CREATE PROCEDURE `high-street-gym`.`UpdateTimetable`()
BEGIN
    DECLARE v_current_date DATE;
    DECLARE v_start_date DATE;
    DECLARE v_end_date DATE;
    DECLARE v_cleanup_date DATE;
    DECLARE v_i INT DEFAULT 0;

    SET v_current_date = CURDATE();
    SET v_start_date = DATE_SUB(v_current_date, INTERVAL WEEKDAY(v_current_date) DAY);
    SET v_end_date = DATE_ADD(v_start_date, INTERVAL 27 DAY);
    SET v_cleanup_date = DATE_SUB(v_start_date, INTERVAL 28 DAY);

    -- Create a temporary table for classes to delete
    CREATE TEMPORARY TABLE temp_classes_to_delete (class_id INT);

    -- Insert class IDs of unbooked, outdated classes into the temp table
    INSERT INTO temp_classes_to_delete (class_id)
    SELECT c.class_id
    FROM `high-street-gym`.`classes` c
    LEFT JOIN `high-street-gym`.`bookings` b
    ON c.class_id = b.booking_class_id
    WHERE c.class_date < v_cleanup_date
    AND b.booking_class_id IS NULL;

    -- Delete using the temporary table
    DELETE FROM `high-street-gym`.`classes`
    WHERE class_id IN (SELECT class_id FROM temp_classes_to_delete);

    -- Drop the temporary table (automatically deleted when session ends)
    DROP TEMPORARY TABLE IF EXISTS temp_classes_to_delete;

    -- Generate timetable for next 4 weeks to avoid duplicates
    WHILE v_i < 28 DO
        INSERT INTO `high-street-gym`.`classes` 
            (class_date, class_time, class_club_id, class_activity_id)
        SELECT 
            DATE_ADD(v_start_date, INTERVAL v_i DAY),
            t.class_time,
            t.class_club_id,
            t.class_activity_id
        FROM `high-street-gym`.`class_timetable_template` t
        WHERE day_of_week = WEEKDAY(DATE_ADD(v_start_date, INTERVAL v_i DAY)) + 1
        AND NOT EXISTS (
            SELECT 1 
            FROM `high-street-gym`.`classes` c
            WHERE c.class_date = DATE_ADD(v_start_date, INTERVAL v_i DAY)
            AND c.class_time = t.class_time
            AND c.class_club_id = t.class_club_id
            AND c.class_activity_id = t.class_activity_id
        );

        SET v_i = v_i + 1;
    END WHILE;
END //

DELIMITER ;


-- Create event scheduler
DROP EVENT IF EXISTS `high-street-gym`.`UpdateTimetableEvent`;

CREATE EVENT `high-street-gym`.`UpdateTimetableEvent`
ON SCHEDULE EVERY 1 WEEK
STARTS CURRENT_TIMESTAMP
DO CALL `high-street-gym`.`UpdateTimetable`();

-- Enable event scheduler
SET GLOBAL event_scheduler = ON;

-- Test the procedure
CALL `high-street-gym`.`UpdateTimetable`();

-- Check if event exists and its status
    SHOW EVENTS FROM `high-street-gym`
    WHERE Name = 'UpdateTimetableEvent';

-- Check event details from information schema
SELECT 
    EVENT_NAME,
    EVENT_TYPE,
    STATUS,
    LAST_EXECUTED,
    LAST_ALTERED,
    CREATED,
    EXECUTE_AT,
    INTERVAL_VALUE,
    INTERVAL_FIELD,
    STARTS,
    ENDS
FROM information_schema.events 
WHERE event_schema = 'high-street-gym' 
AND event_name = 'UpdateTimetableEvent';

-- Check if new classes were generated
SELECT COUNT(*) as class_count, 
       MIN(class_date) as earliest_date, 
       MAX(class_date) as latest_date
FROM `high-street-gym`.`classes`
WHERE class_date >= CURDATE();