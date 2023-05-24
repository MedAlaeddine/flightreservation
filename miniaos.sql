-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 24, 2023 at 12:40 AM
-- Server version: 5.7.36
-- PHP Version: 8.1.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `miniaos`
--

-- --------------------------------------------------------

--
-- Table structure for table `flights`
--

DROP TABLE IF EXISTS `flights`;
CREATE TABLE IF NOT EXISTS `flights` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `airline` varchar(255) NOT NULL,
  `origine` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `price` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `flights`
--

INSERT INTO `flights` (`id`, `airline`, `origine`, `destination`, `price`) VALUES
(2, 'Tunisair', 'Tunis', 'Paris', 250),
(3, 'IndiGo', 'Mumbai', 'Mangalore', 346),
(4, 'Saudiairlines', 'Tunis', 'Mumbai', 2140),
(15, 'szdff', 'dffsdf', 'dvsdfs', 587),
(16, 'Sifax', 'Tunis', 'Djerba', 300);

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `flight_id` int(11) NOT NULL,
  `price` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `flight_id` (`flight_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `flight_id`, `price`) VALUES
(1, 11, 4, 5),
(2, 12, 4, 2500),
(3, 12, 3, 2500);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `cin` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `genre` varchar(255) NOT NULL,
  `role` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cin` (`cin`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `cin`, `password`, `genre`, `role`) VALUES
(12, 'Med', 'Mtir', 'Med@gmail.com', 14000917, 'med', 'male', 2),
(13, 'warda', 'Mtir', 'warda@ala.com', 12345678, '$2b$10$xOMN3FqPcfzr5uxohiXxNud5.CzLL1gUoOPG97XFlVJg/puthtl/a', 'male', 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
