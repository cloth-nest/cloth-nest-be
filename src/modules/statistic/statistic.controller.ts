import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Permission } from '../../shared/enums';
import { Auth } from '../../shared/decorators';
import { StatisticService } from './statistic.service';
import { GetStatisticBodyDTO } from './dto';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Auth(Permission.MANAGE_STATISTIC)
  @Post('')
  @HttpCode(HttpStatus.OK)
  getStatistic(@Body() getStatisticBodyDTO: GetStatisticBodyDTO) {
    return this.statisticService.getStatistic(getStatisticBodyDTO);
  }
}
